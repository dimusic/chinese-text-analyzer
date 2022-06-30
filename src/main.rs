use std::fs;

use analyzer::Analyzer;

fn main() {
    // let str = "LAC是个优秀的分词工具";
    let file = fs::read_to_string("E:\\dev\\rust\\开端.txt").unwrap();

    let analyzer = Analyzer::new();

    //[LAC, 是, 个, 优秀, 的, 分词, 工具]
    //"LAC", "个", "优秀", "分词", "工具", "是", "的"
    analyzer.analyze(&file, false);
    // println!("analyzer output: {:#?}", );
}
