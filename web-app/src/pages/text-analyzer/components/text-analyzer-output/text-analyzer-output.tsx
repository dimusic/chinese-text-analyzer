import { Button, Col, Divider, PageHeader, Row, Statistic, Typography } from "antd";
import html2canvas from "html2canvas";
import { memo, useCallback, useState } from "react";
import { AnalyzerOutput } from "../../../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../../../models/text-analyzer-settings";
import { saveCanvasAsImage } from "../../../../utils/save-canvas";
import { appendWatermark } from "../../../../utils/watermark";
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
    onBack?: () => void;
    useSkeleton?: boolean;
}

function TextAnalyzerOutput(
    { fileName, analyzerOutput, settings, onBack, useSkeleton }: TextAnalyzerOutputProps
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
        )
    };

    const downloadResult = useCallback(async () => {
        try {
            const canvas = await html2canvas(document.body, {
                windowWidth: 412,
                width: 412,
                onclone: appendWatermark,
                ignoreElements: (el: Element) => {
                    const ignoredList = [
                        'settings-btn',
                        'download-results-btn',
                        'ant-page-header-back',
                        'show-modal-btn',
                    ];
                    return Array.from(el.classList).some(className => ignoredList.includes(className));
                }
            });

            saveCanvasAsImage(canvas, fileName);
        }
        catch(e) {
            console.error('download result failed', e);
        };
    }, [fileName]);

    if (!analyzerOutput && !useSkeleton) {
        return null;
    }

    return (
        <div className="text-analyzer-output" style={{
            padding: '20px 20px 15px',
            flexGrow: 1,
        }}>
            <PageHeader
                style={{ paddingTop: 0, paddingLeft: 0 }}
                title={fileName}
                subTitle={`(${settingsToString(settings)})`}
                onBack={onBack}
                extra={[
                    <Button key="1" className="download-results-btn" type="primary" onClick={downloadResult}>Download Result</Button>
                ]}
            ></PageHeader>

            <Row gutter={16} style={{ marginBottom: 20 }}>
                <Col span={12} md={6} style={{marginBottom: 15}}>
                    <Statistic
                        title="Total Characters"
                        value={analyzerOutput?.chars_count}
                        loading={useSkeleton}
                    ></Statistic>
                </Col>

                <Col span={12} md={6} style={{marginBottom: 15}}>
                    <Statistic
                        title="Unique Characters"
                        value={analyzerOutput?.unique_chars_count}
                        loading={useSkeleton}
                        style={{ marginBottom: 15 }}
                    ></Statistic>

                    {analyzerOutput?.unique_chars_count &&
                        <Button
                            className="show-modal-btn"
                            type="primary"
                            onClick={() => setDetailedViewType('unique_chars')}
                        >Show</Button>}
                </Col>

                <Col span={12} md={6} style={{marginBottom: 15}}>
                    <Statistic
                        title="Total Words"
                        value={analyzerOutput?.words_count}
                        loading={useSkeleton}
                    ></Statistic>
                </Col>

                <Col span={12} md={6} style={{marginBottom: 15}}>
                    <Statistic
                        title="Unique Words"
                        value={analyzerOutput?.unique_words_count}
                        loading={useSkeleton}
                        style={{ marginBottom: 15 }}
                    ></Statistic>

                    {analyzerOutput?.unique_chars_count &&
                        <Button
                            className="show-modal-btn"
                            type="primary"
                            onClick={() => setDetailedViewType('unique_words')}
                        >Show</Button>}
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24} md={12}>
                    <Statistic
                        title="Average characters per sentence"
                        value={analyzerOutput?.avg_chars_per_sentence}
                        loading={useSkeleton}
                        style={{ marginBottom: 15 }}
                    ></Statistic>
                </Col>

                <Col span={24} md={0}>
                    <Divider></Divider>
                </Col>

                <Col span={24} md={12}>
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