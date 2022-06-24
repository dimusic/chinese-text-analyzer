import { SettingTwoTone } from "@ant-design/icons";
import { Affix, notification, Drawer, Typography } from "antd";
import { DragEvent, useCallback, useEffect, useRef, useState } from "react";
import languageEncoding from "detect-file-encoding-and-language";
import { AnalyzerOutput } from "../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../models/text-analyzer-settings";
import FileDropOverlay from "./components/file-drop-overlay";
import Settings from "./components/settings";
import TextAnalyzer from "./components/text-analyzer";
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
    const [showFileDropOverlay, setShowFileDropOverlay] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [settings, setSettings] = useState<TextAnalyzerSettings>({
        filterPunctuation: true,
    });
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    let dragCounter = useRef(0);

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

    const handleDragEnter = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current++;
        
        const items = e.dataTransfer.items;
        if (items.length === 0) {
            return;
        }

        setShowFileDropOverlay(true);

        const item = items[0];

        if (items.length > 1 || item.kind !== 'file' || item.type !== 'text/plain') {
            setIsDragAndDropValid(false);
        }
    }, [dragCounter]);

    const handleDragLeave = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        dragCounter.current--;
        if (dragCounter.current === 0) {
            setShowFileDropOverlay(false);
            setIsDragAndDropValid(true);
        }
    }, [dragCounter]);

    const handleDrag = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleFileAnalyze = useCallback(async (file: File) => {
        if (!isDragAndDropValid) {
            setIsDragAndDropValid(true);
            
            return ;
        }

        if (!await isUtf8(file)) {
            setIsDragAndDropValid(true);
            showInvalidEncodingMessage();
            
            return ;
        }

        const text = await file.text();
        const fileName = file.name;

        setIsAnalyzing(true);
        setIsDragAndDropValid(true);
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
    }, [fileName, isDragAndDropValid, settings]);

    const handleFileDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setShowFileDropOverlay(false);

        const files = e.dataTransfer?.files;
        dragCounter.current = 0;

        handleFileAnalyze(files[0]);
    };

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

    return (
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDrag}
            onDrop={handleFileDrop}
            style={{ height: '100%' }}
        >
            {showFileDropOverlay
                ? <FileDropOverlay isValid={isDragAndDropValid}></FileDropOverlay>
                : null}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
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

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                }}>
                    <TextAnalyzer
                        fileName={fileName}
                        analyzerOutput={output}
                        settings={settings}
                        isAnalyzing={isAnalyzing}
                    ></TextAnalyzer>
                </div>
            </div>
        </div>
    );
}

export default TextAnalyzerWasmPage;
