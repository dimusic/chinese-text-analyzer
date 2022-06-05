import { Button, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { MouseEvent, useCallback, useState } from 'react';
import { AnalyzedCounterOutput } from '../../common/analyzer-output';
import TextAnalyzerOutput from './text-analyzer-output';

function TextAnalyzer(
    { onAnalyze, onAnalyzerInit, outputProp }: {
        onAnalyze: (text: string) => void,
        onAnalyzerInit: () => Promise<void>,
        outputProp: AnalyzedCounterOutput | null,
    },
) {
    const [text, setText] = useState("LAC是个优秀的分词工具...");
    // const [output, setOutput] = useState<AnalyzedCounterOutput | null>(null);

    const handleAnalyzeClick = useCallback(async (e: MouseEvent) => {
        const res = await onAnalyze(text);
        // setOutput(res);
    }, [onAnalyze, text]);

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20,
            }}>
                <div>
                    <div style={{ marginBottom: 10 }}>
                        <Button type="default" onClick={onAnalyzerInit}>
                            Init Analyzer
                        </Button>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                        <Checkbox checked={true} disabled={true}>Ignore punctuation</Checkbox>
                    </div>

                    <TextArea
                        rows={3}
                        style={{ marginBottom: 10 }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></TextArea>

                    <Button
                        type="primary"
                        style={{ marginRight: 5 }}
                        onClick={handleAnalyzeClick}
                    >
                        Analyze (jieba)
                    </Button>
                </div>

                <div>
                    {/* <FileAnalyzer

                    ></FileAnalyzer> */}
                </div>
            </div>

            <TextAnalyzerOutput
                analyzerOutput={outputProp}
            ></TextAnalyzerOutput>
        </>
    );
}

export default TextAnalyzer;
