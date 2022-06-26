import { SettingTwoTone } from "@ant-design/icons";
import { Affix, notification, Drawer, Typography, Button, Divider } from "antd";
import { useCallback, useEffect, useState } from "react";
import languageEncoding from "detect-file-encoding-and-language";
import { AnalyzerOutput } from "../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../models/text-analyzer-settings";
import Settings from "./components/settings";
import TextAnalyzer from "./components/text-analyzer";
import FileDragAndDropContainer from "../../components/drag-and-drop/file-drag-and-drop-container";
import { analyze } from '../../wasm/analyzer_wasm';

const showInvalidEncodingMessage = () => {
    notification.error({
        message: 'Wrong file encoding',
        description: 'Only UTF-8 is supported at this time.',
        placement: "topLeft",
    })
};

async function isUtf8(file: File): Promise<boolean> {
    const fileInfo = await languageEncoding(file);
    
    return fileInfo.encoding === 'UTF-8';
}

async function analyzeText(text: string, filterPunctuation: boolean): Promise<AnalyzerOutput> {
    const output = await analyze(text, filterPunctuation) as AnalyzerOutput;
    return output;
}

function TextAnalyzerWasmPage() {
    const [output, setOutput] = useState<AnalyzerOutput | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [fileContent, setFileContent] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [settings, setSettings] = useState<TextAnalyzerSettings>({
        filterPunctuation: true,
    });
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const refresh = useCallback(async (updatedSettings: TextAnalyzerSettings) => {
        setIsAnalyzing(true);

        try {
            let output = await analyzeText(fileContent, updatedSettings.filterPunctuation);
            setOutput(output);
        }
        catch(e) {
            console.error("Failed to analyze file", e);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [fileContent]);

    const validateFile = async (file: File) => {
        if (!await isUtf8(file)) {
            showInvalidEncodingMessage();
            return false;
        }

        return true;
    }

    const handleFileAnalyze = useCallback(async (file: File) => {
        const text = await file.text();
        const fileName = file.name;

        setIsAnalyzing(true);
        setFileContent(text);
        setFileName(fileName);

        try {
            let output = await analyzeText(text, settings.filterPunctuation);
            setOutput(output);
        }
        catch(e) {
            console.error("Failed to analyze file", e);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [settings]);

    const updateSettings = useCallback((settings: TextAnalyzerSettings, refreshOutput: boolean) => {
        localStorage.setItem('settings', JSON.stringify(settings));

        setSettings(settings);
        if (refreshOutput) {
            refresh(settings);
        }
    }, [settings, fileContent, setSettings]);

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, []);

    const renderEmpty = () => {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                width: 500,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: 300,
                    border: '5px dashed #afafaf',
                }}>
                    Drag and drop .txt file to analyze
                </div>
                <div style={{
                    width: '100%',
                    textAlign: 'center',
                }}>
                    <Divider type="horizontal">or</Divider>
                    <Button type="primary">Choose File</Button>
                </div>
            </div>
        );
    }

    return (
        <FileDragAndDropContainer
            onDrop={handleFileAnalyze}
            validateFn={validateFile}
            style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Affix style={{ position: 'absolute', right: 20 }} offsetTop={10}>
                <Typography.Link onClick={() => setIsSettingsVisible(true)}>
                    <SettingTwoTone style={{ fontSize: 22 }} />
                </Typography.Link>
            </Affix>

            <Drawer title="Settings" placement="right" onClose={() => setIsSettingsVisible(false)} visible={isSettingsVisible}>
                <Settings
                    settings={settings}
                    isRefreshRequired={output !== null}
                    onChange={(newSettings, refreshOutput) => updateSettings(newSettings, refreshOutput)}
                />
            </Drawer>

            {!output
                ? renderEmpty()
                : <TextAnalyzer
                    fileName={fileName}
                    analyzerOutput={output}
                    settings={settings}
                    isAnalyzing={isAnalyzing}
                ></TextAnalyzer> }
        </FileDragAndDropContainer>
    );
}

export default TextAnalyzerWasmPage;
