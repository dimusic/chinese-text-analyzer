use analyzer::Analyzer;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn analyze(text: String, filter_punctuation: bool) -> JsValue {
    let analyzer = Analyzer::new();
    let output = analyzer.analyze(&text, filter_punctuation);

    serde_wasm_bindgen::to_value(&output).unwrap()
}
