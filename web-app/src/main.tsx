import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import init from './wasm/analyzer_wasm';
import mixpanel from 'mixpanel-browser';
import './index.css';

function initMixpanel() {
  mixpanel.init("a5ca2e660d3922ae8fa46ba6c40c9d2b", {
    disable_persistence: true,
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await init();

  initMixpanel();

  document.getElementById("loader")!.style.display = 'none';

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );  
});
