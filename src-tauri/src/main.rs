#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

mod utils;
mod analyzer;

use std::fs;

use analyzer::{Analyzer, AnalyzedCounterOutput};

#[tauri::command]
fn analyze_file(analyzer: tauri::State<'_, Analyzer>, file_path: String) -> AnalyzedCounterOutput {
  println!("{}", file_path);

  let text = fs::read_to_string(file_path)
    .unwrap();

  analyzer.analyze(&text)
}

fn main() {
  tauri::Builder::default()
    .manage(Analyzer::new())
    .invoke_handler(tauri::generate_handler![
      analyze_file
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
