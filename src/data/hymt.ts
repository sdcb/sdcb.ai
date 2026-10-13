// HyMT2Sharp 2.0 numbers from the release post and docs/perf.md: Ryzen 7 5800X + RTX 3080 Ti, prefill 512 / decode 128, tok/s.
export type Speed = { pp: number; tg: number } | null;

export interface Quant {
  id: string;
  label: string;
  format: string;
  pkg: string;
  ns: string;
  parts: number;
  size: string;
  vulkan: Speed;
  cuda: Speed;
  cpu: Speed;
  llamaCpu: Speed;
}

export const quants: Quant[] = [
  {
    id: '1.25Bit',
    label: '1.25Bit',
    format: 'STQ1_0',
    pkg: 'Sdcb.GgufWeights.Hy-MT2-1.8B-1.25Bit',
    ns: 'Sdcb.GgufWeights.Hy_MT2_1_8B_1_25Bit',
    parts: 2,
    size: '440 MB',
    vulkan: { pp: 15997, tg: 185 },
    cuda: null,
    cpu: { pp: 564.66, tg: 47.75 },
    llamaCpu: null,
  },
  {
    id: '2Bit',
    label: '2Bit',
    format: 'Q2_0C',
    pkg: 'Sdcb.GgufWeights.Hy-MT2-1.8B-2Bit',
    ns: 'Sdcb.GgufWeights.Hy_MT2_1_8B_2Bit',
    parts: 3,
    size: '573 MB',
    vulkan: { pp: 15801, tg: 299 },
    cuda: null,
    cpu: { pp: 488.95, tg: 47.53 },
    llamaCpu: null,
  },
  {
    id: 'Q4_K_M',
    label: 'Q4_K_M',
    format: 'Q4_K_M',
    pkg: 'Sdcb.GgufWeights.Hy-MT2-1.8B-Q4_K_M',
    ns: 'Sdcb.GgufWeights.Hy_MT2_1_8B_Q4_K_M',
    parts: 5,
    size: '1.1 GB',
    vulkan: { pp: 15834, tg: 277 },
    cuda: { pp: 14378, tg: 336 },
    cpu: { pp: 423.99, tg: 26.55 },
    llamaCpu: { pp: 246.24, tg: 31.57 },
  },
  {
    id: 'Q6_K',
    label: 'Q6_K',
    format: 'Q6_K',
    pkg: 'Sdcb.GgufWeights.Hy-MT2-1.8B-Q6_K',
    ns: 'Sdcb.GgufWeights.Hy_MT2_1_8B_Q6_K',
    parts: 7,
    size: '1.4 GB',
    vulkan: { pp: 15830, tg: 260 },
    cuda: { pp: 13421, tg: 278 },
    cpu: { pp: 403.25, tg: 22.96 },
    llamaCpu: { pp: 139.21, tg: 24.56 },
  },
  {
    id: 'Q8_0',
    label: 'Q8_0',
    format: 'Q8_0',
    pkg: 'Sdcb.GgufWeights.Hy-MT2-1.8B-Q8_0',
    ns: 'Sdcb.GgufWeights.Hy_MT2_1_8B_Q8_0',
    parts: 8,
    size: '1.8 GB',
    vulkan: { pp: 15504, tg: 229 },
    cuda: { pp: 14928, tg: 255 },
    cpu: { pp: 319.81, tg: 16.6 },
    llamaCpu: { pp: 130.7, tg: 19.05 },
  },
];

export const lanes = [
  { key: 'vulkan', name: 'HyMT2Sharp', engine: 'Vulkan · 3080 Ti', ours: true, gpu: true },
  { key: 'cuda', name: 'llama.cpp', engine: 'CUDA · 3080 Ti', ours: false, gpu: true },
  { key: 'cpu', name: 'HyMT2Sharp', engine: 'CPU · 5800X', ours: true, gpu: false },
  { key: 'llamaCpu', name: 'llama.cpp', engine: 'CPU · 5800X', ours: false, gpu: false },
] as const;

// Token counts match the WinForms screenshot in the release post.
export const race = {
  promptTokens: 83,
  outputTokens: 60,
  source:
    'SimdPaddleOCR is officially released today (NuGet: Sdcb.SimdPaddleOCR). It is a complete OCR inference engine written entirely in C#. It does not depend on Paddle Inference or ONNX Runtime, and it does not require shipping OpenCV native libraries.',
  target:
    'SimdPaddleOCR 今天正式发布（NuGet：Sdcb.SimdPaddleOCR）。它是一个完全用 C# 编写的完整 OCR 推理引擎，不依赖 Paddle Inference 或 ONNX Runtime，也不需要附带 OpenCV 原生库。',
};
