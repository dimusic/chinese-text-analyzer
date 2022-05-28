use std::collections::HashSet;

use baidu_lac_rs::output_item::OutputItem;

fn filter_unique(words: &Vec<OutputItem>) -> Vec<String> {
    words.into_iter()
        .map(|output_item| output_item.word.to_owned())
        .collect::<HashSet<_>>()
        .into_iter()
        .collect()
}

fn main() {
    let output_items = baidu_lac_rs::run("LAC是个优秀的分词工具... 是个" );
    
    println!("output_items {:#?}", output_items);

    let unique_words: Vec<String> = filter_unique(&output_items);

    println!("total words count {}", output_items.len());
    println!("total unique words: {:#?}", unique_words.len());

    println!("{:#?}", unique_words);
}
