import { Button, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { MouseEvent, useCallback, useState } from 'react';
import { AnalyzedCounterOutput } from '../../common/analyzer-output';
import TextAnalyzerOutput from './text-analyzer-output';

function TextAnalyzer(
    { onAnalyze, onAnalyzerInit, analyzerOutput }: {
        onAnalyze: (text: string) => void,
        onAnalyzerInit: () => Promise<void>,
        analyzerOutput: AnalyzedCounterOutput | null,
    },
) {
    const [text, setText] = useState("LAC是个优秀的分词工具...");
    
    const handleAnalyzeClick = useCallback(async (e: MouseEvent) => {
        await onAnalyze(text);
    }, [onAnalyze, text]);

    return (
        <>
            {!analyzerOutput
                ? <div> Drop file here to analyze </div>
                : null }

            <TextAnalyzerOutput
                analyzerOutput={analyzerOutput}
            ></TextAnalyzerOutput>
        </>
    );
}

export default TextAnalyzer;
