import "antd/dist/antd.css";
import './app.css';
import TextAnalyzerHoc from './components/text-analyzer/text-analyzer-hoc';

function App() {
  return (
    <div className="app">
      <h1>Chinese Text Analyzer</h1>

      <TextAnalyzerHoc></TextAnalyzerHoc>
    </div>
  )
}

export default App
