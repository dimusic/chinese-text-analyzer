export interface LacOutputItem {
    word: string;
    tag: string;
}

export interface AnalyzedCounterOutput {
    chars_count: number;
    unique_chars_count: number;
    words_count: number;
    unique_words_count: number;
    unique_words: string[];
}
