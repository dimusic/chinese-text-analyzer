import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { Checkbox, Col, Divider, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AnalyzedCounterOutput } from "../../common/analyzer-output";
import FileDropOverlay from "./file-drop-overlay";
import TextAnalyzer from "./text-analyzer";

async function tauriAnalyzeFile(filePath: string, filterPunctuation: boolean): Promise<AnalyzedCounterOutput> {
    let output: AnalyzedCounterOutput = await invoke("analyze_file", {
        filePath,
        filterPunctuation,
    });
    
    return output;
}

function TextAnalyzerHoc() {
    const [output, setOutput] = useState<AnalyzedCounterOutput | null>(null);
    const [isFileDropHovering, setIsFileDropHovering] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [filterPunctuation, setFilterPunctuation] = useState<boolean>(true);

    const analyzerInitCallback = useCallback(() => {
        async function tauriAnalyzerInit(): Promise<void> {
            return await invoke("initialize_analyzer");
        }

        return tauriAnalyzerInit();
    }, []);

    const analyzeTextCallback = useCallback((text: string) => {
        async function tauriAnalyzeText_jieba(text: string): Promise<void> {
            console.log('tauriAnalyzeText_jieba');
            let output: AnalyzedCounterOutput = await invoke("analyze_using_jieba", { text: text });
        
            setOutput(output);
        }

        tauriAnalyzeText_jieba(text)
            .catch(console.error);
    }, []);
    
    useEffect(() => {
        //tauri://file-drop-hover
        //tauri://file-drop-cancelled

        const createTauriFileDropListener = async () => {
            return await listen("tauri://file-drop", async (event) => {
                console.log('file-drop', event);
                const filePath = (event.payload as string[])[0];
                
                setIsFileDropHovering(false);
                setIsAnalyzing(true);

                try {
                    let output = await tauriAnalyzeFile(filePath, filterPunctuation);
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
    }, [filterPunctuation]);

    useEffect(() => {
        const createTauriFileDropHoverListener = async () => {
            return await listen("tauri://file-drop-hover", async (event) => {
                console.log('file-drop-hover:', event);

                setIsFileDropHovering(true);
            });
        };

        let listener = createTauriFileDropHoverListener()
            .catch(console.error);

        return () => {
            listener.then((unsub: any) => unsub());
        };
    }, []);

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
                ? <FileDropOverlay></FileDropOverlay>
                : null}

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}>
                <div style={{ flexGrow: 0, marginBottom: 20 }}>
                    <Divider orientation="left">Settings</Divider>

                    <div style={{ padding: '0 20px' }}>
                        <Checkbox
                            checked={filterPunctuation}
                            onChange={(e) => setFilterPunctuation(e.target.checked)}
                        >Remove Punctuation</Checkbox>
                    </div>
                </div>

                <div style={{
                    flexGrow: 1,
                    display: 'flex',
                }}>
                    <TextAnalyzer
                        onAnalyze={analyzeTextCallback}
                        onAnalyzerInit={analyzerInitCallback}
                        analyzerOutput={output}
                        isAnalyzing={isAnalyzing}
                    ></TextAnalyzer>
                </div>
            </div>
        </>
    );
}

export default TextAnalyzerHoc;