#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;
use std::sync::Mutex;
use std::{collections::HashSet, hash::Hash};
use std::time::Instant;

use baidu_lac_rs::output_item::OutputItem;
use jieba_rs::Jieba;
use serde::{Serialize, Deserialize};

// fn filter_unique<T>(items: &T) -> T
// where T: IntoIterator + FromIterator<<T>::Item>, <T>::Item: Hash, <T>::Item: Eq, <T>::Item: Clone {
//   items.into_iter()
//     .map(|i| { i.clone() })
//     .collect::<HashSet<_>>()
//     .into_iter()
//     .collect()
// }

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

#[derive(Debug, Serialize, Deserialize)]
struct AnalyzedCounterOutput {
  pub chars_count: usize,
  pub unique_chars_count: usize,
  pub words_count: usize,
  pub words: Vec<String>,
  pub unique_words_count: usize,
  pub unique_words: Vec<String>,
}

fn filter_from_str(words: &mut Vec<String>, filter_str: &str) {
  words.retain(|w| {
    !filter_str.contains(w)
  });
}

fn analyze_text_jieba(analyzer: tauri::State<'_, Analyzer>, text: String) -> AnalyzedCounterOutput {
  let punctuation_chars = "\n\r,.:()!@[]+/\\！?？｡。＂＃＄％＆＇（）＊＋，－／：；＜＝＞＠［＼］＾＿｀｛｜｝～｟｠｢｣､、〃《》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟〰〾〿–—‘’‛“”„‟…‧﹏.?;﹔|.-·-*─\''\"";
  
let now = Instant::now();
  let str = text.clone();
  let words = analyzer.instance.lock().unwrap().cut(&str, false);
let elapsed = now.elapsed();
println!("[jieba::cut]: Elapsed: {:.2?}", elapsed);

  let mut unique_words = words.clone();
  filter_unique2(&mut unique_words);
  // let mut unique_words = filter_unique2(&mut words);
  unique_words.sort_by_key(|w| { w.to_owned() });

  let chars: Vec<char> = text.chars().collect();
  let mut unique_chars = chars.clone();
  filter_unique2(&mut unique_chars);
  let mut unique_words: Vec<String> = unique_words.into_iter().map(|w| { w.to_owned() }).collect();
  filter_from_str(&mut unique_words, punctuation_chars);
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

#[tauri::command]
async fn analyze_text(text: String) -> AnalyzedCounterOutput {
  let punctuation_chars = "\n\r,.:()!@[]+/\\！?？｡。＂＃＄％＆＇（）＊＋，－／：；＜＝＞＠［＼］＾＿｀｛｜｝～｟｠｢｣､、〃《》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟〰〾〿–—‘’‛“”„‟…‧﹏.?;﹔|.-·-*─\''\"";

  let output_items = baidu_lac_rs::run(&text);
  // let output_items_len = output_items.len();

  let chars: Vec<char> = text.chars().collect();
  let chars_count = chars.len();
  let mut unique_chars = chars.clone();
  filter_unique2(&mut unique_chars);
  // let unique_chars = filter_unique(&chars);
  let unique_chars_count = unique_chars.len();

  // let words_str: Vec<&str> = output_items.into_iter()
  //   .map(|item| { item.word })
  //   .filter(|word| word != " ")
  //   .collect();
  
  let words: Vec<String> = output_items.iter()
    .map(|item| { item.word.to_owned() })
    .filter(|word| { word != " " })
    .collect();
  let mut unique_words = words.clone();
  filter_unique2(&mut unique_words);
  filter_from_str(&mut unique_words, punctuation_chars);
  
  unique_words.sort_by_key(|w| { w.to_owned() });
  let unique_words_len = unique_words.len();

  AnalyzedCounterOutput {
    chars_count: chars_count,
    unique_chars_count: unique_chars_count,
    unique_words_count: unique_words_len,
    words_count: words.len(),
    words: words,
    unique_words: unique_words,
  }

  // AnalyzedOutput {
  //   chars_count,
  //   unique_chars,
  //   unique_chars_count,
  //   output_items,
  //   words_count: output_items_len,
  //   unique_words: unique_words,
  //   unique_words_count: unique_words_len,
  // }
}

fn filter_unique2<T>(col: &mut Vec<T>)
where T: Eq + Hash + Clone {
  let mut unique = HashSet::new();
  col.retain(|e| unique.insert(e.clone()));
}

#[tauri::command]
fn analyze_using_jieba(analyzer: tauri::State<'_, Analyzer>, text: String) -> AnalyzedCounterOutput {
  analyze_text_jieba(analyzer, text)
}

#[tauri::command]
fn initialize_analyzer(analyzer: tauri::State<'_, Analyzer>) {
  *analyzer.instance.lock().unwrap() = Jieba::new();
}

struct Analyzer {
  pub instance: Mutex<Jieba>,
}

#[tauri::command]
fn analyze_file(analyzer: tauri::State<'_, Analyzer>, file_path: String) -> AnalyzedCounterOutput {
  println!("{}", file_path);

  let text = fs::read_to_string(file_path)
    .unwrap();

  analyze_text_jieba(analyzer, text)
}

fn main() {
  tauri::Builder::default()
    .manage(Analyzer { instance: Default::default() })
    .invoke_handler(tauri::generate_handler![
      initialize_analyzer,
      analyze_text,
      analyze_using_jieba,
      analyze_file
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
