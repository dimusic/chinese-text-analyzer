import { Button, Col, Divider, PageHeader, Row, Statistic, Typography } from "antd";
import { memo, useEffect, useState } from "react";
import { AnalyzerOutput } from "../../../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../../../models/text-analyzer-settings";
import DetailsModal from "./details-modal";
import HskBreakdownTable from "./hsk-breakdown-table";
import ReactGa from 'react-ga';
import './text-analyzer-output.css';

function detailedOutputTypeToTitle(outputType: 'unique_chars' | 'unique_words') {
    switch(outputType) {
        case 'unique_chars':
            return 'Unique Characters';
        
        case 'unique_words':
            return 'Unique Words';

        default:
            return '';
    }
}

function settingsToString(settings: TextAnalyzerSettings): string {
    const punctuationSettingStr = settings.filterPunctuation
        ? 'punctuation removed'
        : 'punctuation included'

    return punctuationSettingStr;
}

interface TextAnalyzerOutputProps {
    fileName: string;
    analyzerOutput: AnalyzerOutput | null;
    settings: TextAnalyzerSettings;
    useSkeleton?: boolean;
}

function TextAnalyzerOutput(
    { fileName, analyzerOutput, settings, useSkeleton }: TextAnalyzerOutputProps
) {
    const [detailedViewType, setDetailedViewType] = useState<'unique_chars' | 'unique_words' | null>(null);

    const renderDetailsModal = () => {
        if (!analyzerOutput || !detailedViewType) {
            return null;
        }

        const content = (analyzerOutput[detailedViewType] as string[]).join('\n');

        return (
            <DetailsModal
                title={detailedOutputTypeToTitle(detailedViewType)}
                visible={Boolean(detailedViewType)}
                content={content}
                onClose={() => setDetailedViewType(null)}
            ></DetailsModal>
        );
    };

    useEffect(() => {
        if (fileName.length > 0) {
            ReactGa.event({
                category: 'Analyzer',
                action: 'Output Generated',
            });
        }
    }, [fileName]);

    if (!analyzerOutput && !useSkeleton) {
        return null;
    }

    console.log('analyzerOutput', analyzerOutput);

    return (
        <div className="text-analyzer-output" style={{
            padding: '20px 20px 15px',
            flexGrow: 1,
        }}>
            <PageHeader
                style={{ paddingTop: 0 }}
                title={fileName}
                subTitle={`(${settingsToString(settings)})`}
            ></PageHeader>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={6}>
                    <Statistic
                        title="Total Characters"
                        value={analyzerOutput?.chars_count}
                        loading={useSkeleton}
                    ></Statistic>
                </Col>

                <Col span={6}>
                    <Statistic
                        title="Unique Characters"
                        value={analyzerOutput?.unique_chars_count}
                        loading={useSkeleton}
                        style={{ marginBottom: 15 }}
                    ></Statistic>

                    {analyzerOutput?.unique_chars_count &&
                        <Button type="primary" onClick={() => setDetailedViewType('unique_chars')}>Show</Button>}
                </Col>

                <Col span={6}>
                    <Statistic
                        title="Total Words"
                        value={analyzerOutput?.words_count}
                        loading={useSkeleton}
                    ></Statistic>
                </Col>

                <Col span={6}>
                    <Statistic
                        title="Unique Words"
                        value={analyzerOutput?.unique_words_count}
                        loading={useSkeleton}
                        style={{ marginBottom: 15 }}
                    ></Statistic>

                    {analyzerOutput?.unique_chars_count &&
                        <Button type="primary" onClick={() => setDetailedViewType('unique_words')}>Show</Button>}
                </Col>
            </Row>

            <Divider></Divider>

            <Row gutter={16}>
                <Col span={12}>
                    <Typography.Title level={4}>HSK Breakdown</Typography.Title>

                    <HskBreakdownTable
                        hskAnalysis={analyzerOutput?.hsk_analysis}
                        totalWordsCount={analyzerOutput?.words_count || 0}
                    ></HskBreakdownTable>
                </Col>
            </Row>

            {renderDetailsModal()}
        </div>
    );
}

export default memo(TextAnalyzerOutput);