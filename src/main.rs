use analyzer::Analyzer;

fn main() {
    let text = "";

    let analyzer = Analyzer::new();
    let output = analyzer.analyze(&text, false);
    println!("analyzer output: {:#?}", output);
}
