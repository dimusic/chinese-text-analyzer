#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod utils;
mod analyzer;

use std::fs;

use analyzer::{Analyzer, AnalyzedCounterOutput};

#[tauri::command]
async fn analyze_file(
    analyzer: tauri::State<'_, Analyzer>,
    file_path: String,
    filter_punctuation: bool,
) -> Result<AnalyzedCounterOutput, bool> {
    println!("{}", file_path);
    
    //@TODO handle failure
    let text = fs::read_to_string(file_path).unwrap();
    
    Ok(analyzer.analyze(&text, filter_punctuation))
}

fn main() {
    #[allow(unused_mut)]
    #[allow(unused_assignments)]
    let mut menu = tauri::Menu::new();

    #[cfg(target_os = "macos")]
    {
        let submenu = tauri::Menu::new()
            .add_native_item(tauri::MenuItem::Copy)
            .add_native_item(tauri::MenuItem::Paste)
            .add_native_item(tauri::MenuItem::Quit);
        
        menu = tauri::Menu::new()
            .add_submenu(tauri::Submenu::new("Chinese Text Analyzer", submenu));
    }
    
    tauri::Builder::default()
        .menu(menu)
        .manage(Analyzer::new())
        .invoke_handler(tauri::generate_handler![
            analyze_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
