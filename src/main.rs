mod dict_utils;
use std::str::Chars;

use paddle_inference_rust_api::{PdConfig, PdPredictor};

use crate::dict_utils::{load_word2id_dict, load_q2b_dict, load_id2label_dict};

fn main() {
    let model_path_raw = String::from("./models/lac_model");
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
    config.set_model_dir("./models/lac_model/model");

    let predictor = PdPredictor::new(&config);
    let input_names = predictor.get_input_names();
    let input_tensor = predictor.get_input_handle(&input_names[0]);
    let output_names = predictor.get_output_names();
    let output_tensor = predictor.get_output_handle(&output_names[0]);

    // generate data
    let mut _sec_words_batch: Vec<Chars> = vec![];
    let mut shape_size: u64 = 0;
    let sec_words = query_str.chars();
    _sec_words_batch.push(sec_words.clone());
    shape_size += sec_words.count() as u64;

    let mut c_lod_vec_: Vec<u64> = vec![0];
    c_lod_vec_.push(shape_size);
    
    let t_lod = vec![c_lod_vec_.clone()];
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

    input_tensor.copy_from_cpu(data);

    predictor.run();

    let output_shape = output_tensor.get_shape();
    let mut output_data: Vec<i64> = vec![0; output_shape[0].try_into().unwrap()];
    output_tensor.copy_to_cpu(&mut output_data);

    println!("output_data: {:?}", output_data);

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
}
