// Hosts the multithreaded .NET WebAssembly runtime. Unlike /ocr/worker.js this module must
// run on the MAIN thread: with WasmEnableThreads the runtime spawns its own deputy and pool
// workers (needs crossOriginIsolated / SharedArrayBuffer).
// dotnet.js has no fingerprint in its name, so forward the page's cache-busting query.
const { dotnet } = await import('./_framework/dotnet.js' + new URL(import.meta.url).search);

let api;
let heap;

export async function start({ onProgress } = {}) {
  const t0 = performance.now();
  const rt = await dotnet
    .withModuleConfig({
      onDownloadResourceProgress: (loaded, total) => onProgress?.(loaded, total),
    })
    .withEnvironmentVariable('GCDRNET_THREADS', String(Math.min(navigator.hardwareConcurrency || 4, 16)))
    .create();
  const bootMs = performance.now() - t0;
  heap = () => rt.localHeapViewU8();
  const exports = await rt.getAssemblyExports(rt.getConfig().mainAssemblyName);
  api = exports.GcdrApi;
  const info = JSON.parse(await api.Init());
  return { ...info, bootMs };
}

// { ms, ptr, len }: the frame stays pinned in the wasm heap until the next Enhance call.
export async function enhance(rgba, width, height) {
  const { ms, ptr, len } = JSON.parse(await api.Enhance(rgba, width, height));
  const dst = new Uint8ClampedArray(len);
  dst.set(heap().subarray(ptr, ptr + len));
  return { rgba: dst, ms };
}
