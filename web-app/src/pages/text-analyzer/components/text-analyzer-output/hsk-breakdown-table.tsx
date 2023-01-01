import { Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { memo } from "react";
import { HskAnalysis } from "../../../../models/analyzer-output";
import { HskTableRow } from "../../../../models/hsk-table-data";

const hskTableColumns: ColumnsType<HskTableRow> = [
    {
        title: "HSK Level",
        dataIndex: "level",
        key: "level",
        align: "center",
        render: (_, record) => <div>{record.level > 0 ? record.level : "–"}</div>,
    },
    {
        title: "Count",
        dataIndex: "count",
        key: "count",
        align: "center",
    },
    {
        title: "Cumulative Frequency",
        dataIndex: "cumFreq",
        key: "cumFreq",
        align: "center",
        render: (_, record) => <div>{(record.cumFreq * 100).toFixed(2)} %</div>,
    },
];

interface HskBreakdownTableProps {
    hskAnalysis?: HskAnalysis;
    totalWordsCount: number;
}

function HskBreakdownTable({ hskAnalysis, totalWordsCount }: HskBreakdownTableProps) {
    if (!hskAnalysis) {
        return <Table columns={hskTableColumns} dataSource={[]} pagination={false} size={"small"} />;
    }

    let hskTableData: HskTableRow[] = [];
    for (let [lvl, value] of hskAnalysis.entries()) {
        hskTableData.push({
            level: parseInt(lvl, 10),
            count: value,
            cumFreq: 0,
            key: `hsk_${lvl}`,
        });
    }

    hskTableData.sort((a, b) => {
        if (a.level === 0) {
            return 1;
        }

        if (b.level === 0) {
            return -1;
        }

        return a.level - b.level;
    });

    hskTableData.forEach((row, i) => {
        let cumFreq = 0;

        if (i === 0) {
            cumFreq = row.count / totalWordsCount;
        } else {
            cumFreq = row.count / totalWordsCount + hskTableData[i - 1].cumFreq;
        }

        hskTableData[i].cumFreq = cumFreq;
    });

    return <Table columns={hskTableColumns} dataSource={hskTableData} pagination={false} size={"small"} />;
}

export default memo(HskBreakdownTable);
