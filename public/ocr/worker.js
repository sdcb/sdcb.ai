// Hosts the .NET WebAssembly runtime off the main thread so OCR never blocks the UI.
import { dotnet } from './_framework/dotnet.js';

let api;

const ready = (async () => {
  const t0 = performance.now();
  const { getAssemblyExports, getConfig } = await dotnet
    .withModuleConfig({
      onDownloadResourceProgress: (loaded, total) => postMessage({ type: 'progress', loaded, total }),
    })
    .create();
  const bootMs = performance.now() - t0;
  const exports = await getAssemblyExports(getConfig().mainAssemblyName);
  api = exports.OcrApi;
  const info = JSON.parse(await api.Init());
  postMessage({ type: 'ready', info: { ...info, bootMs } });
})().catch((e) => postMessage({ type: 'fatal', message: String(e?.message ?? e) }));

onmessage = async (e) => {
  await ready;
  const { id, rgba, width, height } = e.data;
  try {
    const result = JSON.parse(api.Run(rgba, width, height));
    postMessage({ type: 'result', id, result });
  } catch (err) {
    postMessage({ type: 'error', id, message: String(err?.message ?? err) });
  }
};
