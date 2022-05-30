import { List } from "antd";
import { AnalyzerOutput } from "../../common/analyzer-output";

function TextAnalyzerOutput({ analyzerOutput }: { analyzerOutput: AnalyzerOutput | null } ) {
    if (!analyzerOutput) {
        return null;
    }

    console.log('analyzerOutput', analyzerOutput);

    return (
        <div>
            <div>
                <strong>Words Count:</strong> {analyzerOutput.words_count}
            </div>
            <div>
                <strong>Unique Words Count:</strong> {analyzerOutput.unique_words_count}
            </div>
            
            <List
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