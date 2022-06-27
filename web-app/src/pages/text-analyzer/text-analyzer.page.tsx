import { SettingTwoTone } from "@ant-design/icons";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { Affix, Drawer, Typography } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AnalyzerOutput } from "../../models/analyzer-output";
import { TextAnalyzerSettings } from "../../models/text-analyzer-settings";
import FileDropOverlay from "./components/file-drop-overlay";
import Settings from "./components/settings";
import TextAnalyzer from "./components/text-analyzer";

const SUPPORTED_TEXT_FORMATS = ['txt'];

async function tauriAnalyzeFile(filePath: string, filterPunctuation: boolean): Promise<AnalyzerOutput> {
    let output: AnalyzerOutput = await invoke("analyze_file", {
        filePath,
        filterPunctuation,
    });
    
    return output;
}

function TextAnalyzerPage() {
    const [output, setOutput] = useState<AnalyzerOutput | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);
    const [isFileDropHovering, setIsFileDropHovering] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [settings, setSettings] = useState<TextAnalyzerSettings>({
        filterPunctuation: true,
    });
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);
    const [isSettingsVisible, setIsSettingsVisible] = useState(false);

    const refresh = useCallback(async (updatedSettings: TextAnalyzerSettings) => {
        setIsAnalyzing(true);
        try {
            let output = await tauriAnalyzeFile(filePath as string, updatedSettings.filterPunctuation);
            setOutput(output);
        }
        catch(e) {
            console.error("Failed to analyze file", e);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [filePath]);

    const updateSettings = useCallback((settings: TextAnalyzerSettings, refreshOutput: boolean) => {
        localStorage.setItem('settings', JSON.stringify(settings));
        console.log('new settings: ', settings);
        setSettings(settings);

        if (refreshOutput) {
            refresh(settings);
        }
    }, [settings, setSettings]);

    useEffect(() => {
        const savedSettings = localStorage.getItem('settings');
        
        if (savedSettings) {
            console.log('restoring settings');
            setSettings(JSON.parse(savedSettings));
        }
    }, []);
    
    //tauri://file-drop
    useEffect(() => {
        const createTauriFileDropListener = async () => {
            return await listen("tauri://file-drop", async (event) => {
                const eventFilePath = (event.payload as string[])[0];

                setFilePath(eventFilePath);
                setIsFileDropHovering(false);
                setIsAnalyzing(true);
                setIsDragAndDropValid(true);

                try {
                    let output = await tauriAnalyzeFile(eventFilePath, settings.filterPunctuation);
                    setOutput(output);
                }
                catch(e) {
                    console.error("Failed to analyze file", e);
                }
                finally {
                    setIsAnalyzing(false);
                }
            });
        };

        let listener = createTauriFileDropListener()
            .catch(console.error);

        return () => {
            listener.then((unsub: any) => unsub());
        };
    }, [settings, setIsDragAndDropValid]);

    //tauri://file-drop-hover
    useEffect(() => {
        const createTauriFileDropHoverListener = async () => {
            return await listen<string[]>("tauri://file-drop-hover", async (event) => {
                const files = event.payload;

                if (files.length === 0) {
                    return;
                }

                setIsFileDropHovering(true);
                
                if (files.length > 1) {
                    setIsDragAndDropValid(false);
                    return;
                }

                const fileExt = files[0].indexOf('.') > -1
                    && files[0].split('.').pop();

                if (!fileExt || !SUPPORTED_TEXT_FORMATS.includes(fileExt)) {
                    setIsDragAndDropValid(false);
                    return;
                }

                setIsDragAndDropValid(true);
            });
        };

        let listener = createTauriFileDropHoverListener()
            .catch(console.error);

        return () => {
            listener.then((unsub: any) => unsub());
        };
    }, [setIsDragAndDropValid]);

    //tauri://file-drop-cancelled
    useEffect(() => {
        const createTauriFileDropHoverListener = async () => {
            return await listen("tauri://file-drop-cancelled", async (event) => {
                setIsFileDropHovering(false);
            });
        };

        let listener = createTauriFileDropHoverListener()
            .catch(console.error);

        return () => {
            listener.then((unsub: any) => unsub());
        };
    }, []);

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
                        onChange={(newSettings, refreshOutput) => updateSettings(newSettings, refreshOutput)}
                    />
                </Drawer>

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                }}>
                    <TextAnalyzer
                        fileName=''
                        analyzerOutput={output}
                        settings={settings}
                        isAnalyzing={isAnalyzing}
                        onBack={() => setOutput(null)}
                    ></TextAnalyzer>
                </div>
            </div>
        </>
    );
}

export default TextAnalyzerPage;
