use std::{collections::HashSet, hash::Hash};

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

fn filter_from_str(words: &mut Vec<String>, filter_str: &str) {
    words.retain(|w| {
        !filter_str.contains(w)
    });
}
