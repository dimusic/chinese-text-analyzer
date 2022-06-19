import { SettingTwoTone } from "@ant-design/icons";
import { Affix, Drawer, Typography } from "antd";
import { DragEvent, useCallback, useEffect, useRef, useState } from "react";
import { AnalyzerOutput } from "../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../models/text-analyzer-settings";
import FileDropOverlay from "./components/file-drop-overlay";
import Settings from "./components/settings";
import TextAnalyzer from "./components/text-analyzer";
import { analyze } from '../../wasm/analyzer_wasm';

async function analyzeText(text: string, filterPunctuation: boolean): Promise<AnalyzerOutput> {
    const output = await analyze(text, filterPunctuation) as AnalyzerOutput;
    console.log('analyzeText output: ', output);
    return output;
}

function TextAnalyzerWasmPage() {
    const [output, setOutput] = useState<AnalyzerOutput | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [showFileDropOverlay, setShowFileDropOverlay] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [settings, setSettings] = useState<TextAnalyzerSettings>({
        filterPunctuation: true,
    });
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);
    let dragCounter = useRef(0);

    const refresh = useCallback(async () => {
        setIsAnalyzing(true);
        try {
            let output = await analyzeText(fileContent as string, settings.filterPunctuation);
            setOutput(output);
        }
        catch(e) {
            console.error("Failed to analyze file", e);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [fileContent, settings]);

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
            return ;
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

    const handleFileDrop = useCallback((e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setShowFileDropOverlay(false);

        const files = e.dataTransfer?.files;
        dragCounter.current = 0;

        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = async ()=> {
            if (!isDragAndDropValid) {
                setIsDragAndDropValid(true);
                return ;
            }
            
            const text = reader.result as string;
            setIsAnalyzing(true);
            setIsDragAndDropValid(true);
            setFileContent(text);
    
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
        };
    }, [isDragAndDropValid, settings]);

    const updateSettings = useCallback((settings: TextAnalyzerSettings) => {
        localStorage.setItem('settings', JSON.stringify(settings));
        console.log('new settings: ', settings);
        setSettings(settings);
    }, [settings, setSettings]);

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        
        if (savedSettings) {
            console.log('restoring settings');
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
                        onApply={refresh}
                        onChange={updateSettings}
                    />
                </Drawer>

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                }}>
                    <TextAnalyzer
                        analyzerOutput={output}
                        isAnalyzing={isAnalyzing}
                    ></TextAnalyzer>
                </div>
            </div>
        </div>
    );
}

export default TextAnalyzerWasmPage;
