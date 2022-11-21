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
    let hskTableData: HskTableRow[] = Object.keys(hskAnalysis || {})
        .sort((a, b) => {
            if (a === "0" || b === "0") {
                return -1;
            }

            return parseInt(a, 10) - parseInt(b, 10);
        })
        .map((lvl, i) => {
            return {
                level: parseInt(lvl, 10),
                count: hskAnalysis ? (hskAnalysis[lvl] as number) : 0,
                cumFreq: 0,
                key: `${lvl}_${i}`,
            };
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
