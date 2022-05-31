export interface LacOutputItem {
    word: string;
    tag: string;
}

export interface AnalyzerOutput {
    chars_count: number;
    unique_chars: string[];
    unique_chars_count: number;
    words_count: number;
    unique_words_count: number;
    output_items: LacOutputItem[];
    unique_words: string[];
};
