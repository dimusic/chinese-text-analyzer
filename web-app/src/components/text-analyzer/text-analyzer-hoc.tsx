import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useState } from "react";
import { AnalyzedCounterOutput } from "../../common/analyzer-output";
import TextAnalyzer from "./text-analyzer";

async function tauriAnalyzeFile(filePath: string): Promise<AnalyzedCounterOutput> {
    let output: AnalyzedCounterOutput = await invoke("analyze_file", { filePath });
    
    return output;
}

function TextAnalyzerHoc() {
    const [output, setOutput] = useState<AnalyzedCounterOutput | null>(null);
    const [isFileDropHovering, setIsFileDropHovering] = useState<boolean>(false);

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

                let output = await tauriAnalyzeFile(filePath);
                setOutput(output);
            });
        };

        let listener = createTauriFileDropListener()
            .catch(console.error);

        return () => {
            listener.then((unsub: any) => unsub());
        };
    }, []);

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
        <TextAnalyzer
            onAnalyze={analyzeTextCallback}
            onAnalyzerInit={analyzerInitCallback}
            outputProp={output}
            isFileDropHovering={isFileDropHovering}
        ></TextAnalyzer>
    );
}

export default TextAnalyzerHoc;