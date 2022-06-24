import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import init from './wasm/analyzer_wasm';
import './index.css';

document.addEventListener('DOMContentLoaded', async () => {
  await init();

  document.getElementById("loader")!.style.display = 'none';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );  
});
