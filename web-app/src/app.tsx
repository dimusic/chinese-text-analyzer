import "antd/dist/antd.css";
import { useEffect } from "react";
import './app.css';
import TextAnalyzerPage from "./pages/text-analyzer/text-analyzer.page";
import init, { analyze } from './wasm/analyzer';

function App() {
  // useEffect(() => {
  //   init().then(() => {
  //     const text = `落魄魔术师宗九穿书了
  //     `;
  //     const analyzed = analyze(text, true);
  
  //     console.log(analyzed);
  //   });
  // }, []);

  return (
    <div className="app">
      <TextAnalyzerPage></TextAnalyzerPage>
    </div>
  )
}

export default App
