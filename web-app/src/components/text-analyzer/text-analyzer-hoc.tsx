import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { useCallback, useEffect, useState } from "react";
import { AnalyzedCounterOutput, AnalyzerOutput } from "../../common/analyzer-output";
import TextAnalyzer from "./text-analyzer";

async function tauriAnalyzeText_baidu(text: string): Promise<AnalyzedCounterOutput> {
    console.log('tauriAnalyzeText_baidu');
    let output: AnalyzedCounterOutput = await invoke("analyze_text", { text: text });
    
    return output;
}

async function tauriAnalyzeFile(filePath: string): Promise<AnalyzedCounterOutput> {
    let output: AnalyzedCounterOutput = await invoke("analyze_file", { filePath });
    
    return output;
}

function TextAnalyzerHoc() {
    const [output, setOutput] = useState<AnalyzedCounterOutput | null>(null);

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

    return (
        <TextAnalyzer
            onAnalyze={analyzeTextCallback}
            onAnalyzeOld={tauriAnalyzeText_baidu}
            onAnalyzerInit={analyzerInitCallback}
            outputProp={output}
        ></TextAnalyzer>
    );
}

export default TextAnalyzerHoc;