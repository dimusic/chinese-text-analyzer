import { MouseEvent, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

function TextAnalyzer() {
    const [text, setText] = useState("LAC是个优秀的分词工具... 是个");
    const [output, setOutput] = useState('');

    async function analyzeText(e: MouseEvent) {
        let output: any = await invoke("analyze_text", { text: text });

        let analyze_str = `
            Total words: ${output.total_words};
            Total unique words: ${output.total_unique_words}
            Unique Words:
            ${output.unique_words.map((w: string) => `${w}\n`)}
        `;

        setOutput(analyze_str);
    }

    return (
        <div>
            <h5>chinese-text-analyzer</h5>

            <div>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
            </div>

            <div>
                <button type="button" onClick={analyzeText}>
                    Analyze
                </button>
            </div>

            <div>
                <h6>Output:</h6>
                <div>
                    <pre dangerouslySetInnerHTML={{__html: output}}>
                    </pre>
                </div>
            </div>
        </div>
    );
}

export default TextAnalyzer;
