import { List, Skeleton } from "antd";
import { AnalyzedCounterOutput } from "../../common/analyzer-output";

function TextAnalyzerOutput(
    { analyzerOutput, useSkeleton }: {
        analyzerOutput: AnalyzedCounterOutput | null,
        useSkeleton?: boolean,
    }
) {
    if (!analyzerOutput && !useSkeleton) {
        return null;
    }

    console.log('analyzerOutput', analyzerOutput);

    const charsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.chars_count;
    
    const uniqueCharsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.unique_chars_count;
    
    const wordsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.words_count;

    const uniqueWordsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.unique_words_count;

    return (
        <div style={{
            padding: '0 20px',
            flexGrow: 1,
        }}>
            <div style={{ marginBottom: 5 }}>
                <strong>Character Count:</strong> {charsCount}
            </div>
            <div style={{ marginBottom: 5 }}>
                <strong>Unique Character Count:</strong> {uniqueCharsCount}
            </div>
            <div style={{ marginBottom: 5 }}>
                <strong>Words Count:</strong> {wordsCount}
            </div>
            <div style={{ marginBottom: 5 }}>
                <strong>Unique Words Count:</strong> {uniqueWordsCount}
            </div>

            {analyzerOutput && <List
                rowKey={word => word}
                size="small"
                header={<div>Unique Words:</div>}
                footer={null}
                bordered
                dataSource={analyzerOutput.unique_words}
                renderItem={word => <List.Item>{word}</List.Item>}
            />}
        </div>
    );
}

export default TextAnalyzerOutput;