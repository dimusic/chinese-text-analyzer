import "antd/dist/antd.css";
import './app.css';
import TextAnalyzerHoc from './components/text-analyzer/text-analyzer-hoc';
import { appWindow } from '@tauri-apps/api/window'
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const minimize = () => appWindow.minimize();
    const maximize = () => appWindow.toggleMaximize();
    const close = () => appWindow.close();

    const minimizeBtn = document?.getElementById('titlebar-minimize');
    const maximizeBtn = document?.getElementById('titlebar-maximize');
    const closeBtn = document?.getElementById('titlebar-close');

    minimizeBtn?.addEventListener('click', minimize);
    maximizeBtn?.addEventListener('click', maximize);
    closeBtn?.addEventListener('click', close);

    return () => {
      minimizeBtn?.removeEventListener('click', minimize);
      maximizeBtn?.removeEventListener('click', maximize);
      closeBtn?.removeEventListener('click', close);
    }
  });

  return (
    <div className="app" style={{ paddingTop: 30 }}>
      <TextAnalyzerHoc></TextAnalyzerHoc>
    </div>
  )
}

export default App
