import { Divider, Input, Typography } from "antd";
import { ChangeEvent } from "react";

interface SelectFileProps {
    onFileSelect: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
}

function SelectFile({ onFileSelect }: SelectFileProps) {
    return (
        <div
            style={{
                display: "flex",
                margin: "0 auto",
                paddingTop: 30,
                flexDirection: "column",
                height: "100%",
                width: 412,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Typography.Title level={2}>Chinese Text Analyzer</Typography.Title>
            <Typography.Text type="secondary" style={{ textAlign: "center", marginBottom: 15 }}>
                Calculate total and unique character and word count in a text file, HSK Breakdown and more!
            </Typography.Text>

            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: 300,
                    border: "5px dashed #afafaf",
                }}
            >
                Drag and drop .txt file to analyze
            </div>
            <div
                style={{
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <Divider type="horizontal">or</Divider>
                <Input type="file" accept="text/plain" onChange={onFileSelect}></Input>
            </div>
        </div>
    );
}

export default SelectFile;
