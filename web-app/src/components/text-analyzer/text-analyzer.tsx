import { Typography } from 'antd';
import { AnalyzedCounterOutput } from '../../common/analyzer-output';
import TextAnalyzerOutput from './text-analyzer-output';

const { Text } = Typography;

interface TextAnalyzerProps {
    analyzerOutput: AnalyzedCounterOutput | null,
    isAnalyzing: boolean,
}

function TextAnalyzer(
    { analyzerOutput, isAnalyzing }: TextAnalyzerProps,
) {
    if (isAnalyzing) {
        return (
            <TextAnalyzerOutput
                useSkeleton={true}
                analyzerOutput={null}
            ></TextAnalyzerOutput>
        );
    }

    const renderEmpty = () => (
        <div style={{
            flexGrow: 1,
            border: '10px dashed #afafaf',
            padding: '10px 20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text strong>Drop .txt file here to analyze</Text>
        </div>
    );

    return (
        <>
            {!analyzerOutput
                ? renderEmpty()
                : null }

            <TextAnalyzerOutput
                analyzerOutput={analyzerOutput}
            ></TextAnalyzerOutput>
        </>
    );
}

export default TextAnalyzer;
