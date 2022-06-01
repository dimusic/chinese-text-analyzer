import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { AnalyzerOutput } from "../../common/analyzer-output";
import TextAnalyzer from "./text-analyzer";

async function tauriAnalyzeText(text: string): Promise<AnalyzerOutput> {
    let output: AnalyzerOutput = await invoke("analyze_text", { text: text });

    return output;
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
            onAnalyze={tauriAnalyzeText}
        ></TextAnalyzer>
    );
}

export default TextAnalyzerHoc;