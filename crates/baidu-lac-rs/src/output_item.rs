use serde::{ Serialize, Deserialize };


#[derive(Debug, Serialize, Deserialize)]
pub struct OutputItem {
    pub word: String,
    pub tag: String,
}
