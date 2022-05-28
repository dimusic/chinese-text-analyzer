// use baidu_lac_rs::output_item::OutputItem;


fn main() {
    let output = baidu_lac_rs::run(String::from("LAC是个优秀的分词工具... 是个" ));
    
    println!("{:#?}", output);
}
