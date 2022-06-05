import { List } from "antd";
import { AnalyzedCounterOutput } from "../../common/analyzer-output";

function TextAnalyzerOutput({ analyzerOutput }: { analyzerOutput: AnalyzedCounterOutput | null } ) {
    if (!analyzerOutput) {
        return null;
    }

    console.log('analyzerOutput', analyzerOutput);

    return (
        <div>
            <div>
                <strong>Character Count:</strong> {analyzerOutput.chars_count}
            </div>
            <div>
                <strong>Unique Character Count:</strong> {analyzerOutput.unique_chars_count}
            </div>
            <div>
                <strong>Words Count:</strong> {analyzerOutput.words_count}
            </div>
            <div>
                <strong>Unique Words Count:</strong> {analyzerOutput.unique_words_count}
            </div>

            <List
                rowKey={word => word}
                size="small"
                header={<div>Unique Words:</div>}
                footer={null}
                bordered
                dataSource={analyzerOutput.unique_words}
                renderItem={word => <List.Item>{word}</List.Item>}
            />
        </div>
    );
}

export default TextAnalyzerOutput;