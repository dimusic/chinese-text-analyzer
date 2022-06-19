import { Typography } from 'antd';
import { AnalyzerOutput } from '../../../models/analyzer-output';
import { TextAnalyzerSettings } from '../../../models/text-analyzer-settings';
import TextAnalyzerOutput from './text-analyzer-output/text-analyzer-output';

const { Text } = Typography;

interface TextAnalyzerProps {
    fileName: string;
    analyzerOutput: AnalyzerOutput | null;
    settings: TextAnalyzerSettings;
    isAnalyzing: boolean;
}

function TextAnalyzer(
    { fileName, analyzerOutput, settings, isAnalyzing }: TextAnalyzerProps,
) {
    if (isAnalyzing) {
        return (
            <TextAnalyzerOutput
                fileName={''}
                settings={settings}
                useSkeleton={true}
                analyzerOutput={null}
            ></TextAnalyzerOutput>
        );
    }

    const renderEmpty = () => (
        <div style={{
            flexGrow: 1,
            border: '5px dashed #afafaf',
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
                fileName={fileName}
                analyzerOutput={analyzerOutput}
                settings={settings}
            ></TextAnalyzerOutput>
        </>
    );
}

export default TextAnalyzer;
