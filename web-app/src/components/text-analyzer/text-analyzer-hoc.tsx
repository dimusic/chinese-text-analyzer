import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { Divider } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AnalyzerOutput } from "../../common/analyzer-output";
import { TextAnalyzerSettings } from "../../interface/text-analyzer-settings";
import FileDropOverlay from "./file-drop-overlay";
import Settings from "./settings";
import TextAnalyzer from "./text-analyzer";

const SUPPORTED_TEXT_FORMATS = ['txt'];

async function tauriAnalyzeFile(filePath: string, filterPunctuation: boolean): Promise<AnalyzerOutput> {
    let output: AnalyzerOutput = await invoke("analyze_file", {
        filePath,
        filterPunctuation,
    });
    
    return output;
}

function TextAnalyzerHoc() {
    const [output, setOutput] = useState<AnalyzerOutput | null>(null);
    const [filePath, setFilePath] = useState<string | null>(null);
    const [isFileDropHovering, setIsFileDropHovering] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [settings, setSettings] = useState<TextAnalyzerSettings>({
        filterPunctuation: true,
    });
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);

    const refresh = useCallback(async () => {
        setIsAnalyzing(true);
        try {
            let output = await tauriAnalyzeFile(filePath as string, settings.filterPunctuation);
            setOutput(output);
        }
        catch(e) {
            console.error("Failed to analyze file", e);
        }
        finally {
            setIsAnalyzing(false);
        }
    }, [filePath, settings]);
    
    //tauri://file-drop
    useEffect(() => {
        const createTauriFileDropListener = async () => {
            return await listen("tauri://file-drop", async (event) => {
                console.log('file-drop', event);
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
                console.log('file-drop-hover:', event);
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
                console.log('file-drop-cancelled:', event);

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
                <div style={{ flexGrow: 0, marginBottom: 20 }}>
                    <Divider orientation="left">Settings</Divider>

                    <Settings
                        settings={settings}
                        isRefreshRequired={output !== null}
                        onRefresh={refresh}
                        onChange={(settings) => setSettings(settings)}
                    />
                </div>

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

export default TextAnalyzerHoc;