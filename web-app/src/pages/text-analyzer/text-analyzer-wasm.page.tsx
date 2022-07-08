import { SettingTwoTone } from "@ant-design/icons";
import { Affix, Drawer, Typography, Divider, Input } from "antd";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { detect } from 'jschardet';
import { AnalyzerOutput } from "../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../models/text-analyzer-settings";
import Settings from "./components/settings";
import TextAnalyzer from "./components/text-analyzer";
import FileDragAndDropContainer from "../../components/drag-and-drop/file-drag-and-drop-container";
import { analyze } from '../../wasm/analyzer_wasm';
import { showErrorMessage } from "../../utils/show-error";
import SelectFile from "./components/select-file";

const showInvalidEncodingMessage = () => {
    showErrorMessage("Wrong file encoding", "Only UTF-8 is supported at this time.");
};

async function isUtf8(file: File): Promise<boolean> {
    const buffer = new Uint8Array(await file.arrayBuffer());
    let binaryStr = '';
    for(let i = 0; i < buffer.length; i++) {
        binaryStr += String.fromCharCode(buffer[i]);
    }
    try {
        const detectionResult = detect(binaryStr);
        return detectionResult.encoding === 'UTF-8';
    }
    catch(e) {
        console.error('Encoding detection failed: ', e);
        return false;
    }
    
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

    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return ;
        }

        const file = e.target.files![0];
        if (await validateFile(file)) {
            await handleFileAnalyze(file);
        }
    }

    const renderEmpty = () => {
        return <SelectFile
            onFileSelect={handleFileInputChange}
        ></SelectFile>
    }

    return (
        <FileDragAndDropContainer
            onDrop={handleFileAnalyze}
            validateFn={validateFile}
        >
            {!output &&
                <Affix className="settings-btn" style={{ position: 'absolute', right: 20 }} offsetTop={10}>
                    <Typography.Link onClick={() => setIsSettingsVisible(true)}>
                        <SettingTwoTone style={{ fontSize: 22 }} />
                    </Typography.Link>
                </Affix>}

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
                    onBack={() => setOutput(null)}
                    onSettingsClick={() => setIsSettingsVisible(true)}
                ></TextAnalyzer> }
        </FileDragAndDropContainer>
    );
}

export default TextAnalyzerWasmPage;
