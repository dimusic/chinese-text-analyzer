#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::collections::HashSet;

use baidu_lac_rs::output_item::OutputItem;
use serde::{Serialize, Deserialize};

fn filter_unique(output_items: &Vec<OutputItem>) -> Vec<String> {
  output_items.into_iter()
      .map(|output_item| output_item.word.to_owned())
      .collect::<HashSet<_>>()
      .into_iter()
      .collect()
}

#[derive(Debug, Serialize, Deserialize)]
struct AnalyzedOutput {
  pub output_items: Vec<OutputItem>,
  pub total_words: usize,
  pub unique_words: Vec<String>,
  pub total_unique_words: usize,
}

#[tauri::command]
fn analyze_text(text: &str) -> AnalyzedOutput {
  println!("I was invoked from JS! {}", text);
  let output_items = baidu_lac_rs::run(text);
  let output_items_len = output_items.len();
  let unique_words = filter_unique(&output_items);
  let unique_words_len = unique_words.len();

  AnalyzedOutput {
    output_items,
    total_words: output_items_len,
    unique_words: unique_words,
    total_unique_words: unique_words_len,
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![analyze_text])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
