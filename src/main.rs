use analyzer::Analyzer;

fn main() {
    // let str = "LAC是个优秀的分词工具";
    let str = r"始循环!

    　　第!三次。
    　　不是她。";
    let analyzer = Analyzer::new();

    //[LAC, 是, 个, 优秀, 的, 分词, 工具]
    //"LAC", "个", "优秀", "分词", "工具", "是", "的"
    println!("analyzer output: {:#?}", analyzer.analyze(str, true));
}
