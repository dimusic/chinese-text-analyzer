import { Button, Col, Modal, Row, Statistic, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { ColumnsType } from "antd/lib/table";
import { memo, useState } from "react";
import { AnalyzerOutput } from "../../interface/analyzer-output";
import { HskTableRow } from "../../interface/hsk-table-data";
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
            <Modal
                title={detailedOutputTypeToTitle(detailedViewType)}
                centered
                visible={Boolean(detailedViewType)}
                width={1000}
                onCancel={() => setDetailedViewType(null)}
                footer={[
                    <Button key="close" type="default" onClick={() => setDetailedViewType(null)}>
                        Close
                    </Button>,
                ]}
            >
                <TextArea
                    value={content}
                    rows={6}
                    readOnly={true}
                ></TextArea>
            </Modal>
        );
    };

    const hskTableColumns: ColumnsType<HskTableRow> = [{
        title: 'HSK Level',
        dataIndex: 'level',
        key: 'level',
        render: (_, record) => (
            <div>
                {record.level > 0
                    ? record.level
                    : '–' }
            </div>
        )
    }, {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
    }];
    let hskTableData: HskTableRow[] = Object.keys(analyzerOutput?.hsk_analysis || {}).map((lvl) => {
        return {
            level: parseInt(lvl, 10),
            count: analyzerOutput?.hsk_analysis[lvl] as number,
        };
    });

    hskTableData.sort((a, b) => b.level - a.level);

    console.log('analyzerOutput', analyzerOutput);

    return (
        <div className="text-analyzer-output" style={{
            padding: '0 20px',
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

            <Table
                columns={hskTableColumns}
                dataSource={hskTableData}
                pagination={false}
            />

            {renderDetailsModal()}
        </div>
    );
}

export default memo(TextAnalyzerOutput);