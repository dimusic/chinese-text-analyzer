import { Col, List, Row, Skeleton, Statistic } from "antd";
import { memo } from "react";
import { AnalyzedCounterOutput } from "../../common/analyzer-output";

function TextAnalyzerOutput(
    { analyzerOutput, useSkeleton }: {
        analyzerOutput: AnalyzedCounterOutput | null,
        useSkeleton?: boolean,
    }
) {
    if (!analyzerOutput && !useSkeleton) {
        return null;
    }

    console.log('analyzerOutput', analyzerOutput);

    const charsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.chars_count;
    
    const uniqueCharsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.unique_chars_count;
    
    const wordsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.words_count;

    const uniqueWordsCount = useSkeleton
        ? <Skeleton.Input active size="small" />
        : analyzerOutput?.unique_words_count;

    return (
        <div style={{
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
                    ></Statistic>
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
                    ></Statistic>
                </Col>
            </Row>

            {analyzerOutput && <List
                rowKey={word => word}
                size="small"
                header={<div>Unique Words:</div>}
                footer={null}
                bordered
                dataSource={analyzerOutput.unique_words}
                renderItem={word => <List.Item>{word}</List.Item>}
            />}
        </div>
    );
}

export default memo(TextAnalyzerOutput);