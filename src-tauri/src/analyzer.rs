use std::sync::Mutex;

use jieba_rs::Jieba;
use serde::{Serialize, Deserialize};

use crate::{utils::{filter_chars, filter_unique}};

static PUNCTUATION_CHARS_STR: &str = ",.:()!@[]+/\\！?？｡。＂＃＄％＆＇（）＊＋，－／：；＜＝＞＠［＼］＾＿｀｛｜｝～｟｠｢｣､、〃《》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟〰〾〿–—‘’‛“”„‟…‧﹏.?;﹔|.-·-*─\''\"";

#[derive(Debug, Serialize, Deserialize)]
pub struct AnalyzedCounterOutput {
    pub chars_count: usize,
    pub unique_chars_count: usize,
    pub words_count: usize,
    pub words: Vec<String>,
    pub unique_words_count: usize,
    pub unique_words: Vec<String>,
}

pub struct Analyzer {
    pub instance: Mutex<Jieba>,
    punctuation_chars: Vec<char>,
}

impl Analyzer {
    pub fn new() -> Self {
        let punctuation_chars: Vec<char> = PUNCTUATION_CHARS_STR.chars().into_iter().collect();

        Self {
            instance: Mutex::new(Jieba::new()),
            punctuation_chars
        }
    }

    pub fn analyze(&self, text: &str) -> AnalyzedCounterOutput {
        let chars: Vec<char> = text.chars().collect();
        let chars = filter_chars(&chars, &self.punctuation_chars);

        let mut unique_chars = chars.clone();
        filter_unique(&mut unique_chars);

        let filtered_text: String = chars.iter().collect();
        let words = self.instance.lock().unwrap().cut(&filtered_text, false);
        
        let mut unique_words = words.clone();
        filter_unique(&mut unique_words);
        let mut unique_words: Vec<String> = unique_words.into_iter()
            .map(|w| { w.to_owned() })
            .collect();
        unique_words.sort_by_key(|w| { w.to_owned() });

        let words: Vec<String> = words.into_iter().map(|w| { w.to_owned() }).collect();

        AnalyzedCounterOutput {
            chars_count: chars.len(),
            unique_chars_count: unique_chars.len(),
            words_count: words.len(),
            words: words,
            unique_words_count: unique_words.len(),
            unique_words: unique_words,
        }
    }
}
