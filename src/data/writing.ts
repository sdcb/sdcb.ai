import type { L10n } from '../i18n';
import { snapshot } from './snapshot';

export type Series = { id: string; name: L10n; blurb: L10n; match: RegExp };

// First match wins, so order matters.
export const series: Series[] = [
  {
    id: 'simd',
    name: { zh: 'SimdPaddleOCR 与手写 SIMD', en: 'SimdPaddleOCR & hand-written SIMD' },
    blurb: { zh: '纯 C# 推理引擎从 0 到 1.4 的全过程。', en: 'Building a pure-C# inference engine, 1.0 → 1.4.' },
    match: /SimdPaddleOCR|向量化|HyMT2Sharp/i,
  },
  {
    id: 'chats',
    name: { zh: 'Sdcb Chats 开发手记', en: 'Building Sdcb Chats' },
    blurb: { zh: '一个 AI 网关的版本演进与踩坑。', en: 'Release notes and lessons from an AI gateway.' },
    match: /Chats/,
  },
  {
    id: 'llm',
    name: { zh: '大模型、MCP 与协议', en: 'LLMs, MCP & protocols' },
    blurb: { zh: '从协议抓包到 Code Interpreter。', en: 'From packet captures to code interpreters.' },
    match: /MCP|大模型|交错思考|C# Runner|AI 时代|JSON Schema|json-schema|DeepSeek/i,
  },
  {
    id: 'perf',
    name: { zh: '性能对决', en: 'Performance showdowns' },
    blurb: { zh: '.NET 对阵 C++ / Go / Java，用数据说话。', en: '.NET vs C++ / Go / Java — measured, not guessed.' },
    match: /性能|跑分|vs|快上|提升|远胜|Draw Call|LINQ|CircularBuffer|StringBuilder|System\.Text\.Json|HttpClient|正则/i,
  },
  {
    id: 'cv',
    name: { zh: '计算机视觉与多媒体', en: 'Computer vision & media' },
    blurb: { zh: 'PaddleOCR、OpenVINO、FFmpeg、RAW 照片。', en: 'PaddleOCR, OpenVINO, FFmpeg and RAW photos.' },
    match: /Paddle|OpenVINO|FFmpeg|RAW|ARW|OpenCV|人脸|WordCloud|文字云|水印|验证码|高精度|弹幕/i,
  },
  {
    id: 'security',
    name: { zh: '密码学与安全', en: 'Cryptography & security' },
    blurb: { zh: 'AES、Cookie、MachineKey 的来龙去脉。', en: 'AES, cookies, MachineKey — how they really work.' },
    match: /AES|加密|MachineKey|Cookie|密码|敏感信息/i,
  },
  {
    id: 'graphics',
    name: { zh: '图形、模拟与趣味编程', en: 'Graphics, simulation & fun' },
    blurb: { zh: 'Direct2D、天体运动、小游戏。', en: 'Direct2D, orbital mechanics, tiny games.' },
    match: /Direct2D|DWrite|2048|太极|时钟|天体|N-Body|圣诞|桌面背景|算命|抽奖|扫雷|类图/i,
  },
];

export const otherSeries: Series = {
  id: 'misc',
  name: { zh: 'C# 与 .NET 杂谈', en: 'C# & .NET notes' },
  blurb: { zh: '语言特性、框架细节与一些随想。', en: 'Language features, framework details and musings.' },
  match: /.*/,
};

export const posts = snapshot.blog.posts.map((p) => ({
  ...p,
  series: (series.find((s) => s.match.test(p.title)) ?? otherSeries).id,
}));

export type PostWithSeries = (typeof posts)[number];
