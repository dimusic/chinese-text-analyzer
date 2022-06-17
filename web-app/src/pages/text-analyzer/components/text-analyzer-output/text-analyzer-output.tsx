import { Button, Col, Divider, Row, Statistic, Typography } from "antd";
import { memo, useState } from "react";
import { AnalyzerOutput } from "../../../../models/analyzer-output";
import DetailsModal from "./details-modal";
import HskBreakdownTable from "./hsk-breakdown-table";
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

function TextAnalyzerOutput(
    { analyzerOutput, useSkeleton }: {
        analyzerOutput: AnalyzerOutput | null,
        useSkeleton?: boolean,
    }
) {
    const [detailedViewType, setDetailedViewType] = useState<'unique_chars' | 'unique_words' | null>(null);

    if (!analyzerOutput && !useSkeleton) {
        return null;
    }

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

    console.log('analyzerOutput', analyzerOutput);

    return (
        <div className="text-analyzer-output" style={{
            padding: '20px 20px 15px',
            flexGrow: 1,
        }}>
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