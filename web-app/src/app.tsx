import "antd/dist/antd.css";
import './app.css';
import TextAnalyzerWasmPage from "./pages/text-analyzer/text-analyzer-wasm.page";
import TextAnalyzerPage from "./pages/text-analyzer/text-analyzer.page";

const IS_TAURI: boolean = typeof window.__TAURI_IPC__ !== 'undefined';

function App() {
  return (
    <div className="app">
      {IS_TAURI
        ? <TextAnalyzerPage></TextAnalyzerPage>
        : <TextAnalyzerWasmPage></TextAnalyzerWasmPage>}
    </div>
  )
}

export default App
