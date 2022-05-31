#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{collections::HashSet, hash::Hash};

use baidu_lac_rs::output_item::OutputItem;
use serde::{Serialize, Deserialize};

fn filter_unique<T>(items: T) -> T
where T: IntoIterator + FromIterator<<T>::Item>, <T>::Item: Hash, <T>::Item: Eq {
  items.into_iter()
    .collect::<HashSet<_>>()
    .into_iter()
    .collect()
}

#[derive(Debug, Serialize, Deserialize)]
struct AnalyzedOutput {
  pub chars_count: usize,
  pub unique_chars: Vec<char>,
  pub unique_chars_count: usize,
  pub output_items: Vec<OutputItem>,
  pub words_count: usize,
  pub unique_words: Vec<String>,
  pub unique_words_count: usize,
}

#[tauri::command]
fn analyze_text(text: &str) -> AnalyzedOutput {
  let output_items = baidu_lac_rs::run(text);
  let output_items_len = output_items.len();

  let chars: Vec<char> = text.chars().collect();
  let chars_count = chars.len();
  let unique_chars = filter_unique(chars);
  let unique_chars_count = unique_chars.len();
  
  let words: Vec<String> = output_items.clone().into_iter()
    .map(|item| { item.word.to_owned() })
    .filter(|word| { word != " " })
    .collect();
  let mut unique_words = filter_unique(words);
  unique_words.sort_by_key(|w| { w.to_owned() });
  let unique_words_len = unique_words.len();

  AnalyzedOutput {
    chars_count,
    unique_chars,
    unique_chars_count,
    output_items,
    words_count: output_items_len,
    unique_words: unique_words,
    unique_words_count: unique_words_len,
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![analyze_text])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
