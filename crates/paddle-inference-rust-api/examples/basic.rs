use std::{collections::HashMap, fs::File, io::{BufReader, BufRead}, str::Chars};

use paddle_inference_rust_api::{PdConfig, PdPredictor, get_version};

fn load_word2id_dict(path: String) -> HashMap<String, i64> {
    let mut dict: HashMap<String, i64> = HashMap::new();

    let file = File::open(path.clone())
        .expect(&format!("Failed to open word2id at {}", path.clone()));
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        let line = line.split("\t").collect::<Vec<&str>>();
        if line.len() > 0 && line.len() == 2 {
            let id: i64 = line[0].parse::<i64>().expect(&format!("Failed to parse word id {:?}", line));
            let word = line[1];

            dict.insert(word.to_owned(), id);
        }
    }

    return dict;
}

fn load_q2b_dict(path: String) -> HashMap<String, String> {
    let mut dict: HashMap<String, String> = HashMap::new();

    let file = File::open(path.clone())
        .expect(&format!("Failed to open q2bdict at {}", path.clone()));
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        let line = line.split("\t").collect::<Vec<&str>>();
        if line.len() > 0 && line.len() == 2 {
            let word1 = line[0];
            let word = line[1];

            dict.insert(word1.to_owned(), word.to_owned());
        }
    }

    return dict;
}

fn load_id2label_dict(path: String) -> HashMap<i64, String> {
    let mut dict: HashMap<i64, String> = HashMap::new();

    let file = File::open(path.clone())
        .expect(&format!("Failed to open q2bdict at {}", path.clone()));
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        let line = line.split("\t").collect::<Vec<&str>>();
        if line.len() > 0 && line.len() == 2 {
            let id: i64 = line[0].parse::<i64>().expect(&format!("Failed to parse word id {:?}", line));
            let word = line[1];

            dict.insert(id, word.to_owned());
        }
    }

    return dict;
}

fn main() {
    let model_path_raw = String::from("./examples/models/lac_model");
    let word2dict = load_word2id_dict(format!("{}/conf/word.dic", model_path_raw.clone()));
    let q2b_dict = load_q2b_dict(format!("{}/conf/q2b.dic", model_path_raw.clone()));
    let id2label_dict = load_id2label_dict(format!("{}/conf/tag.dic", model_path_raw.clone()));
    
    let _oov_id: i64 = word2dict.get("OOV")
        .unwrap_or(&(word2dict.len() as i64 - 1))
        .to_owned();

    let query_str = String::from("LAC是个优秀的分词工具");

    let config = PdConfig::new();
    config.disable_gpu();
    config.disable_glog_info();
    config.set_cpu_math_library_num_threads(1);
    config.set_model_dir("./examples/models/lac_model/model");
    
    println!("config {:?}", config.get_raw_config_ptr());

    let predictor = PdPredictor::new(&config);
    println!("predictor {:?}", predictor.get_raw_predictor_ptr());

    let input_names = predictor.get_input_names();
    println!("input_names: {:?}", input_names);

    let input_tensor = predictor.get_input_handle(&input_names[0]);
    println!("input_tensor: {:?}", input_tensor);

    let output_names = predictor.get_output_names();
    println!("output_names: {:?}", output_names);

    let output_tensor = predictor.get_output_handle(&output_names[0]);
    println!("output_tensor: {:?}", output_tensor);

    // generate data
    let mut _sec_words_batch: Vec<Chars> = vec![];
    let mut shape_size: u64 = 0;
    let sec_words = query_str.chars();
    _sec_words_batch.push(sec_words.clone());
    shape_size += sec_words.count() as u64;

    let mut c_lod_vec_: Vec<u64> = vec![0];
    c_lod_vec_.push(shape_size);
    
    let t_lod = vec![c_lod_vec_.clone()];


    println!("lod: {:?}", t_lod);

    input_tensor.set_lod(t_lod);

    let shape: Vec<i32> = vec![_sec_words_batch[0].clone().count() as i32, 1];
    println!("shape: {:?}", shape);
    input_tensor.reshape(shape);

    let data: Vec<i64> = _sec_words_batch[0].clone().into_iter().map(|c| {
        let mut word = c.clone().to_string();
        if let Some(q2b_word) = q2b_dict.get(&word) {
            word = q2b_word.to_owned();
        }

        let mut word_id: i64 = _oov_id;
        if let Some(dict_id) = word2dict.get(&word) {
            word_id = dict_id.to_owned();
        }

        word_id
    }).collect();

    println!("data: {:?}", data);

    input_tensor.copy_from_cpu(data);

    let d_type = input_tensor.get_data_type();
    println!("d-type {:?}", d_type);

    predictor.run();

    // let mut output_data: [i64; 12] = [0; 12];
    // output_tensor.copy_to_cpu_tmp(&mut output_data);

    let output_shape = output_tensor.get_shape();
    println!("output_shape: {:?}", output_shape);

    println!("input_tensor: {:?}", input_tensor);
    println!("output_tensor: {:?}", output_tensor);

    let mut output_data: Vec<i64> = vec![0; output_shape[0].try_into().unwrap()];
    output_tensor.copy_to_cpu(&mut output_data);

    for (i, c) in c_lod_vec_.iter().enumerate() {
        let next = c_lod_vec_.get(i + 1)
            .or(Some(&0))
            .unwrap();
        println!("j: {} - {}", next, c);
    }

    for oid in output_data.iter() {
        if let Some(label) = id2label_dict.get(oid) {
            println!("label: {}", label);


        }
        else {
            println!("no label for: {}", oid);
        }
    }

    println!("ouput_data: {:?}", output_data);
    let get_lod = input_tensor.get_lod();
    println!("get_lod: {:?}", get_lod);

    let input_tensor_name = input_tensor.get_name();
    println!("input_tensor_name: {}", input_tensor_name);

    let version = get_version();
    println!("version: {:?}", version);
}
