
use std::{sync::Mutex, collections::HashMap};

use jieba_rs::Jieba;
use lazy_static::lazy_static;
use regex::Regex;
use serde::{Serialize};

use crate::{utils::{filter_unique, normalize_text, filter_text_punctuation}};


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

fn get_chars_per_sentence(text: &str) -> usize {
    lazy_static! {
        static ref REGEX_END_OF_SENTENCE: Regex = Regex::new(r"[。.!\?\r\n]+").unwrap();
        static ref REGEX_ALL_SPACES: Regex = Regex::new(r"[\s\r\n]+").unwrap();
    }

    let sentences: Vec<_> = REGEX_END_OF_SENTENCE.split(text)
        .into_iter()
        .map(|sentence| {
            REGEX_ALL_SPACES.replace_all(sentence, "")
        })
        .filter(|sentence| { sentence.chars().count() >= 2 })
        .collect();

        sentences.iter().for_each(|s| println!("{}; len: {}", s, s.chars().count()));

    let total_sentences = sentences.len();
    let total_chars = sentences.into_iter()
        .fold(0, |prev, current| {
            current.chars().count() + prev
        });
    
    if total_sentences > 0 {
        total_chars / total_sentences
    }
    else {
        0
    }
}

#[derive(Debug, Serialize)]
pub struct AnalyzedCounterOutput {
    pub chars_count: usize,
    pub unique_chars_count: usize,
    pub unique_chars: Vec<char>,
    pub words_count: usize,
    pub unique_words_count: usize,
    pub unique_words: Vec<String>,
    pub hsk_analysis: HashMap<u8, i64>,
    pub avg_chars_per_sentence: usize,
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
        let avg_chars_per_sentence = get_chars_per_sentence(&text);

        let mut text = normalize_text(text);

        if filter_punctuation {
            text = filter_text_punctuation(&text);
        }

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
            avg_chars_per_sentence,
        }
    }
}
