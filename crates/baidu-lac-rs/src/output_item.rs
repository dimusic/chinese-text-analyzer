use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputItem {
    pub word: String,
    pub tag: String,
}
