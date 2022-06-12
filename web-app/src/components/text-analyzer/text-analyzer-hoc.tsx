import { listen, Event } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { Checkbox, Col, Divider, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { AnalyzedCounterOutput } from "../../common/analyzer-output";
import FileDropOverlay from "./file-drop-overlay";
import TextAnalyzer from "./text-analyzer";

const SUPPORTED_TEXT_FORMATS = ['txt'];

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
    const [isDragAndDropValid, setIsDragAndDropValid] = useState<boolean>(true);
    
    //tauri://file-drop
    useEffect(() => {
        const createTauriFileDropListener = async () => {
            return await listen("tauri://file-drop", async (event) => {
                console.log('file-drop', event);
                const filePath = (event.payload as string[])[0];
                
                setIsFileDropHovering(false);
                setIsAnalyzing(true);
                setIsDragAndDropValid(true);

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
    }, [filterPunctuation, setIsDragAndDropValid]);

    //tauri://file-drop-hover
    useEffect(() => {
        const createTauriFileDropHoverListener = async () => {
            return await listen<string[]>("tauri://file-drop-hover", async (event) => {
                console.log('file-drop-hover:', event);
                const files = event.payload;

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
                        analyzerOutput={output}
                        isAnalyzing={isAnalyzing}
                    ></TextAnalyzer>
                </div>
            </div>
        </>
    );
}

export default TextAnalyzerHoc;