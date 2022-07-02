
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
        .filter(|sentence| { sentence.chars().count() > 0 })
        .collect();

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

fn get_chars_per_paragraph(text: &str) -> usize {
    lazy_static! {
        static ref REGEX_LINE_BREAK: Regex = Regex::new(r"[\r\n]+").unwrap();
        static ref REGEX_ALL_SPACES: Regex = Regex::new(r"[\s\r\n]+").unwrap();
    }

    let paragraphs: Vec<_> = REGEX_LINE_BREAK.split(text)
        .into_iter()
        .map(|paragraph| {
            REGEX_ALL_SPACES.replace_all(paragraph, "")
        })
        .filter(|paragraph| { paragraph.len() > 0 })
        .collect();

    let total_paragraphs = paragraphs.len();
    let total_chars = paragraphs.into_iter()
        .fold(0, |prev, current| {
            current.chars().count() + prev
        });
    
    if total_chars > 0 {
        total_chars / total_paragraphs
    }
    else {
        0
    }
}

#[derive(Debug, Serialize)]
pub struct AnalyzerOutput {
    pub chars_count: usize,
    pub unique_chars_count: usize,
    pub unique_chars: Vec<char>,
    pub words_count: usize,
    pub unique_words_count: usize,
    pub unique_words: Vec<String>,
    pub hsk_analysis: HashMap<u8, i64>,
    pub avg_chars_per_sentence: usize,
    pub avg_chars_per_paragraph: usize,
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

    pub fn analyze(&self, text: &str, filter_punctuation: bool) -> AnalyzerOutput {
        //strip BOM
        let text = match text.starts_with("\u{feff}") {
            true => &text[3..],
            false => text
        };

        let avg_chars_per_sentence = get_chars_per_sentence(text);
        let avg_chars_per_paragraph = get_chars_per_paragraph(text);
        
        let text = normalize_text(text);
        let mut filtered_text = text.clone();

        if filter_punctuation {
            filtered_text = filter_text_punctuation(&filtered_text);
        }

        let chars: Vec<char> = filtered_text.chars().collect();

        let mut unique_chars = chars.clone();
        filter_unique(&mut unique_chars);

        let words: Vec<&str> = self.instance.lock().unwrap().cut(&text, false)
            .into_iter()
            .filter(|&word| {
                if word == " " {
                    return false
                }

                let word_filtered = filter_text_punctuation(word);
                
                word_filtered.len() > 0 && word_filtered != " "
            })
            .collect();
        
        let mut unique_words = words.clone();
        filter_unique(&mut unique_words);
        let mut unique_words: Vec<String> = unique_words.into_iter()
            .map(|w| { w.to_owned() })
            .collect();
        unique_words.sort_by_key(|w| { w.to_owned() });

        let hsk_analysis = get_hsk_analysis(&words);
        
        AnalyzerOutput {
            chars_count: chars.len(),
            unique_chars_count: unique_chars.len(),
            unique_chars,
            words_count: words.len(),
            unique_words_count: unique_words.len(),
            unique_words,
            hsk_analysis,
            avg_chars_per_sentence,
            avg_chars_per_paragraph,
        }
    }
}
