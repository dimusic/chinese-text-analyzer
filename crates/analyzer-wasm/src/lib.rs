use wasm_bindgen::prelude::*;
use analyzer::Analyzer;

#[wasm_bindgen]
pub fn analyze(text: String, filter_punctuation: bool) -> JsValue {
    let analyzer = Analyzer::new();
    let output = analyzer.analyze(&text, filter_punctuation);

    JsValue::from_serde(&output).unwrap()
}
