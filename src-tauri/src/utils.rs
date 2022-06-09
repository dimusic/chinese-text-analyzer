use std::{collections::HashSet, hash::Hash};

use lazy_static::lazy_static;
use regex::Regex;
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
    lazy_static! {
        static ref REGEX_EXTRA_SPACES: Regex = Regex::new(r"[\s]+").unwrap();
    }

    let text = REGEX_EXTRA_SPACES.replace_all(text, " ");

    if !filter_punctuation {
        return text.nfkd().collect();
    }
    
    text.nfkd().filter(|c| {
        match get_general_category(*c) {
            GeneralCategory::LineSeparator |
            GeneralCategory::ParagraphSeparator |
            GeneralCategory::DashPunctuation |
            GeneralCategory::OpenPunctuation |
            GeneralCategory::ClosePunctuation |
            GeneralCategory::FinalPunctuation |
            GeneralCategory::InitialPunctuation |
            GeneralCategory::ConnectorPunctuation |
            GeneralCategory::OtherPunctuation |
            GeneralCategory::Format |
            GeneralCategory::Control |
            GeneralCategory::SpacingMark |
            GeneralCategory::NonspacingMark |
            GeneralCategory::EnclosingMark |
            GeneralCategory::Unassigned |
            GeneralCategory::OtherSymbol |
            GeneralCategory::ModifierSymbol |
            GeneralCategory::CurrencySymbol |
            GeneralCategory::Surrogate |
            GeneralCategory::MathSymbol => false,
            _ => true
        }
    }).collect()
}
