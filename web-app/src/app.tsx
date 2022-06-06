import "antd/dist/antd.css";
import './app.css';
import TextAnalyzerHoc from './components/text-analyzer/text-analyzer-hoc';

function App() {
  return (
    <div className="app">
      <TextAnalyzerHoc></TextAnalyzerHoc>
    </div>
  )
}

export default App
