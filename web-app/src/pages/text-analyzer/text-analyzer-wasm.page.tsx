import { SettingTwoTone } from "@ant-design/icons";
import { Affix, Drawer, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AnalyzerOutput } from "../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../models/text-analyzer-settings";
import DragAndDrop from "./components/drag-and-drop/drag-and-drop";
import FileDropOverlay from "./components/file-drop-overlay";
import Settings from "./components/settings";
import TextAnalyzer from "./components/text-analyzer";
import init, { analyze } from '../../wasm/analyzer_wasm';

const SUPPORTED_TEXT_FORMATS = ['txt'];

async function analyzeText(text: string, filterPunctuation: boolean): Promise<AnalyzerOutput> {
    await init();
    
    const output = await analyze(text, filterPunctuation) as AnalyzerOutput;
    console.log('analyzeText output: ', output);
    return output;
}

function TextAnalyzerWasmPage() {
    const [output, setOutput] = useState<AnalyzerOutput | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);
    const [isFileDropHovering, setIsFileDropHovering] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [settings, setSettings] = useState<TextAnalyzerSettings>({
        filterPunctuation: true,
    });
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const refresh = useCallback(async () => {
        setIsAnalyzing(true);
        try {
            let output = await analyzeText(filePath as string, settings.filterPunctuation);
            setOutput(output);
        }
        catch(e) {
            console.error("Failed to analyze file", e);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [filePath, settings]);

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

    const analyzeCallback = useCallback(async (text: string) => {
        let output = await analyzeText(text, settings.filterPunctuation);
        setOutput(output);
    }, [output, settings, setOutput]);

    if (!output) {
        return (
            <DragAndDrop processDrop={analyzeCallback}>
                <div>Drag and drop files here</div>
            </DragAndDrop>
        );
    }

    return (
        <>
            {isFileDropHovering
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
        </>
    );
}

export default TextAnalyzerWasmPage;
