import { Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { MouseEvent, useCallback, useState } from 'react';
import { AnalyzerOutput } from '../../common/analyzer-output';
import TextAnalyzerOutput from './text-analyzer-output';

function TextAnalyzer({ onAnalyze }: { onAnalyze: (text: string) => Promise<AnalyzerOutput> }) {
    const [text, setText] = useState("LAC是个优秀的分词工具...");
    const [output, setOutput] = useState<AnalyzerOutput | null>(null);

    const handleAnalyzeClick = useCallback(async (e: MouseEvent) => {
        const res = await onAnalyze(text);
        setOutput(res);
    }, [onAnalyze, text]);

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20,
            }}>
                <div>
                    <TextArea
                        rows={3}
                        style={{ marginBottom: 10 }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></TextArea>

                    <Button type="primary" onClick={handleAnalyzeClick}>
                        Analyze
                    </Button>
                </div>

                <div>

                </div>
            </div>

            <TextAnalyzerOutput
                analyzerOutput={output}
            ></TextAnalyzerOutput>
        </>
    );
}

export default TextAnalyzer;
