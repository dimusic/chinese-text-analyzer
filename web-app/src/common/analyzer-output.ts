export interface LacOutputItem {
    word: string;
    tag: string;
}

export interface AnalyzerOutput {
    words_count: number;
    unique_words_count: number;
    output_items: LacOutputItem[];
    unique_words: string[];
};
