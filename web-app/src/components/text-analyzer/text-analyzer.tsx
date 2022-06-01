import { Button } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { MouseEvent, useCallback, useState } from 'react';
import { AnalyzedCounterOutput, AnalyzerOutput } from '../../common/analyzer-output';
import FileAnalyzer from './file-analyzer';
import TextAnalyzerOutput from './text-analyzer-output';

function TextAnalyzer(
    { onAnalyze, onAnalyzeOld, onAnalyzerInit }: {
        onAnalyze: (text: string) => Promise<AnalyzedCounterOutput>,
        onAnalyzeOld: (text: string) => Promise<AnalyzerOutput>,
        onAnalyzerInit: () => Promise<void>,
    },
) {
    const [text, setText] = useState("LAC是个优秀的分词工具...");
    const [output, setOutput] = useState<AnalyzedCounterOutput | null>(null);

    const handleAnalyzeClick = useCallback(async (e: MouseEvent) => {
        const res = await onAnalyze(text);
        setOutput(res);
    }, [onAnalyze, text]);

    const handleAnalyzeOldClick = useCallback(async (e: MouseEvent) => {
        const res = await onAnalyzeOld(text);
        setOutput(res);
    }, [onAnalyzeOld, text]);

    return (
        <>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 20,
            }}>
                <div>
                    <div>
                        <Button type="default" onClick={onAnalyzerInit}>
                            Init Analyzer
                        </Button>
                    </div>

                    <TextArea
                        rows={3}
                        style={{ marginBottom: 10 }}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></TextArea>

                    <Button type="primary" onClick={handleAnalyzeClick}>
                        Analyze (jieba)
                    </Button>
                    
                    <Button type="primary" onClick={handleAnalyzeOldClick}>
                        Analyze (baidu)
                    </Button>
                </div>

                <div>
                    {/* <FileAnalyzer

                    ></FileAnalyzer> */}
                </div>
            </div>

            <TextAnalyzerOutput
                analyzerOutput={output}
            ></TextAnalyzerOutput>
        </>
    );
}

export default TextAnalyzer;
