use std::{collections::HashMap, fs::File, io::{BufReader, BufRead}};


pub fn load_word2id_dict(path: String) -> HashMap<String, i64> {
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

pub fn load_q2b_dict(path: String) -> HashMap<String, String> {
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

pub fn load_id2label_dict(path: String) -> HashMap<i64, String> {
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
