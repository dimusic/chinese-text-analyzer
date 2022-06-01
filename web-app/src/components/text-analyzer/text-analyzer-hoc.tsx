import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { AnalyzedCounterOutput, AnalyzerOutput } from "../../common/analyzer-output";
import TextAnalyzer from "./text-analyzer";

async function tauriAnalyzeText_jieba(text: string): Promise<AnalyzedCounterOutput> {
    console.log('tauriAnalyzeText_jieba');
    let output: AnalyzedCounterOutput = await invoke("analyze_using_jieba", { text: text });

    return output;
}

async function tauriAnalyzeText_baidu(text: string): Promise<AnalyzerOutput> {
    console.log('tauriAnalyzeText_baidu');
    let output: AnalyzerOutput = await invoke("analyze_text", { text: text });
    
    return output;
}

async function tauriAnalyzerInit(): Promise<void> {
    return await invoke("initialize_analyzer");
}

function TextAnalyzerHoc() {
    useEffect(() => {
        //tauri://file-drop-hover
        //tauri://file-drop-cancelled

        const createTauriFileDropListener = async () => {
            return await listen("tauri://file-drop", (event) => {
                console.log('file-drop', event);
                const filePath = (event.payload as string[])[0];

                //read file

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
            onAnalyze={tauriAnalyzeText_jieba}
            onAnalyzeOld={tauriAnalyzeText_baidu}
            onAnalyzerInit={tauriAnalyzerInit}
        ></TextAnalyzer>
    );
}

export default TextAnalyzerHoc;