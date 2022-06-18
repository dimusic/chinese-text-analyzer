mod analyzer;
mod utils;

use analyzer::Analyzer;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn analyze(text: String, filter_punctuation: bool) -> i32 {
    let analyzer = Analyzer::new();
    let output = analyzer.analyze(&text, filter_punctuation);

    output.words_count.try_into().unwrap()
}
