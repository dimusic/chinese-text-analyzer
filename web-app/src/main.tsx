import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import init from './wasm/analyzer_wasm';
import ReactGa from 'react-ga';
import './index.css';

ReactGa.initialize('G-MCC0XMTXYR');

document.addEventListener('DOMContentLoaded', async () => {
  await init();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );  
});
