import init, { analyze } from './wasm/analyzer_wasm';

self.addEventListener('message', async (event) => {



    const text = event.data[0];
    const filterPunctuation = event.data[1];

    console.log('message received', 'text: ', text, 'filer:', filterPunctuation);
    await init();
    const output = await analyze(text, filterPunctuation);

    console.log('output: ', output);
    self.postMessage(output);

});
