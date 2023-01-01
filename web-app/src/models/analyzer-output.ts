export interface LacOutputItem {
    word: string;
    tag: string;
}

export type HskAnalysis = Map<string, number>;

export interface AnalyzerOutput {
    chars_count: number;
    unique_chars_count: number;
    unique_chars: string[];
    words_count: number;
    unique_words_count: number;
    unique_words: string[];
    hsk_analysis: HskAnalysis;
    avg_chars_per_sentence: number;
    avg_chars_per_paragraph: number;
}
