use std::{sync::Mutex, collections::HashMap};

use jieba_rs::Jieba;
use serde::{Serialize, Deserialize};

use crate::{utils::{filter_unique, normalize_text}};


fn get_hsk_analysis(words: &[&str]) -> HashMap<u8, i64> {
    let hsk_list = hsk::Hsk::new();
    let mut res: HashMap<u8, i64> = HashMap::new();
    res.insert(0, 0);
    res.insert(1, 0);
    res.insert(2, 0);
    res.insert(3, 0);
    res.insert(4, 0);
    res.insert(5, 0);
    res.insert(6, 0);

    words.iter().for_each(|word| {
        let hsk_level: u8 = hsk_list.get_hsk(word);

        *res.entry(hsk_level).or_insert(0) += 1;
    });

    res
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalyzedCounterOutput {
    pub chars_count: usize,
    pub unique_chars_count: usize,
    pub unique_chars: Vec<char>,
    pub words_count: usize,
    pub unique_words_count: usize,
    pub unique_words: Vec<String>,
    pub hsk_analysis: HashMap<u8, i64>,
}

pub struct Analyzer {
    pub instance: Mutex<Jieba>,
}

impl Analyzer {
    pub fn new() -> Self {
        Self {
            instance: Mutex::new(Jieba::new()),
        }
    }

    pub fn analyze(&self, text: &str, filter_punctuation: bool) -> AnalyzedCounterOutput {
        let text = normalize_text(text, filter_punctuation);

        let chars: Vec<char> = text.chars().collect();

        let mut unique_chars = chars.clone();
        filter_unique(&mut unique_chars);

        let filtered_text: String = chars.iter().collect();
        let words = self.instance.lock().unwrap().cut(&filtered_text, false);
        
        let mut unique_words = words.clone();
        filter_unique(&mut unique_words);
        let mut unique_words: Vec<String> = unique_words.into_iter()
            .filter(|&w| { w != " " })
            .map(|w| { w.to_owned() })
            .collect();
        unique_words.sort_by_key(|w| { w.to_owned() });

        let hsk_analysis = get_hsk_analysis(&words);
        
        AnalyzedCounterOutput {
            chars_count: chars.len(),
            unique_chars_count: unique_chars.len(),
            unique_chars,
            words_count: words.len(),
            unique_words_count: unique_words.len(),
            unique_words,
            hsk_analysis,
        }
    }
}
