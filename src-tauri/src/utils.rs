use std::{collections::HashSet, hash::Hash};

use unicode_general_category::{GeneralCategory, get_general_category};
use unicode_normalization::UnicodeNormalization;

pub fn filter_chars(chars: &[char], filter_chars: &[char]) -> Vec<char> {
    chars.clone().into_iter().filter(|&&c| {
        filter_chars.iter().find(|&&fc| { fc == c }).is_none()
    }).map(|c| { c.to_owned() }).collect()
}

pub fn filter_unique<T>(col: &mut Vec<T>)
where T: Eq + Hash + Clone {
  let mut unique = HashSet::new();
  col.retain(|e| unique.insert(e.clone()));
}

pub fn filter_from_str(words: &mut Vec<String>, filter_str: &str) {
    words.retain(|w| {
        !filter_str.contains(w)
    });
}

pub fn normalize_text(text: &str, filter_punctuation: bool) -> String {
    if !filter_punctuation {
        return text.nfkd().collect();
    }
    
    text.nfkd().filter(|c| {
        match get_general_category(*c) {
            GeneralCategory::DashPunctuation |
            GeneralCategory::OpenPunctuation |
            GeneralCategory::ClosePunctuation |
            GeneralCategory::FinalPunctuation |
            GeneralCategory::InitialPunctuation |
            GeneralCategory::ConnectorPunctuation |
            GeneralCategory::OtherPunctuation |
            GeneralCategory::MathSymbol |
            GeneralCategory::NonspacingMark |
            GeneralCategory::EnclosingMark |
            GeneralCategory::CurrencySymbol |
            GeneralCategory::ModifierSymbol |
            GeneralCategory::OtherSymbol |
            GeneralCategory::Unassigned |
            GeneralCategory::LineSeparator |
            GeneralCategory::ParagraphSeparator => false,
            _ => true
        }
    }).collect()
}
