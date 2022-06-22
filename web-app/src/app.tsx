import TextAnalyzerWasmPage from "./pages/text-analyzer/text-analyzer-wasm.page";
import TextAnalyzerPage from "./pages/text-analyzer/text-analyzer.page";
import "antd/dist/antd.css";
import './app.css';
import { AnalyzerWorkerProvider } from "./analyzer-worker-provider";

const IS_TAURI: boolean = typeof window.__TAURI_IPC__ !== 'undefined';

function App() {
  return (
    <div className="app">
      {IS_TAURI
        ? <TextAnalyzerPage></TextAnalyzerPage>
        : (
          <AnalyzerWorkerProvider>
            <TextAnalyzerWasmPage></TextAnalyzerWasmPage>
          </AnalyzerWorkerProvider>
        )}
    </div>
  )
}

export default App
