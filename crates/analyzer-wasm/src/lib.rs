use wasm_bindgen::prelude::*;
use analyzer::Analyzer;

#[wasm_bindgen]
pub fn analyze(text: String, filter_punctuation: bool) -> i32 {
    let analyzer = Analyzer::new();
    let output = analyzer.analyze(&text, filter_punctuation);

    output.words_count.try_into().unwrap()
}
