import { invoke } from "@tauri-apps/api/tauri";
import { AnalyzerOutput } from "../../common/analyzer-output";
import TextAnalyzer from "./text-analyzer";

async function tauriAnalyzeText(text: string): Promise<AnalyzerOutput> {
    let output: AnalyzerOutput = await invoke("analyze_text", { text: text });

    return output;
}

function TextAnalyzerHoc() {
    return (
        <TextAnalyzer
            onAnalyze={tauriAnalyzeText}
        ></TextAnalyzer>
    );
}

export default TextAnalyzerHoc;