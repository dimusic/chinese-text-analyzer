import init, { analyze } from './wasm/analyzer_wasm';

self.addEventListener('message', async (event) => {
    const text = event.data[0];
    const filterPunctuation = event.data[1];

    await init();
    const output = await analyze(text, filterPunctuation);

    self.postMessage(output);
});
