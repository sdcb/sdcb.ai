import type { L10n } from '../i18n';

export type Milestone = { date: string; title: L10n; body: L10n; link?: string; highlight?: boolean };

export const timeline: Milestone[] = [
  {
    date: '2013',
    title: { zh: '在博客园写下第一批文章', en: 'First posts on cnblogs' },
    body: {
      zh: 'Direct2D、DWrite、shared_ptr——从 C++ 与 Windows 图形编程起步。',
      en: 'Direct2D, DWrite, shared_ptr — starting out with C++ and Windows graphics.',
    },
    link: 'https://www.cnblogs.com/sdcb/archive/2013/04/18/3028212.html',
  },
  {
    date: '2016',
    title: { zh: 'sdmap：动态 SQL 模板引擎', en: 'sdmap: a dynamic SQL template engine' },
    body: {
      zh: '第一个被大量使用的 .NET 开源库，至今 NuGet 下载超过十万次。',
      en: 'My first widely used .NET library — 100k+ NuGet downloads to date.',
    },
    link: 'https://github.com/sdcb/sdmap',
  },
  {
    date: '2019',
    title: { zh: '《.NET骚操作》诞生', en: 'The “.NET骚操作” blog & WeChat account' },
    body: {
      zh: '博客与微信公众号同步更新：斗鱼弹幕、人脸识别、RAW 解码、2048……用 .NET 做“不像 .NET 能做”的事。',
      en: 'Blog and WeChat account launch: live-stream danmaku, face detection, RAW decoding, 2048 — doing things people didn’t think .NET could do.',
    },
    link: 'https://www.cnblogs.com/sdcb/p/20190801-dotnet-value-type-and-reference-type.html',
  },
  {
    date: '2021',
    title: { zh: 'PaddleSharp 发布，登上 .NET Conf China', en: 'PaddleSharp, and .NET Conf China' },
    body: {
      zh: '把百度飞桨带进 .NET，成为 .NET 下最受欢迎的 OCR 方案之一；在 .NET Conf China 2021 分享《.NET 玩转计算机视觉 OpenCV》。',
      en: 'Bringing Baidu Paddle to .NET — soon one of the most popular OCR stacks in .NET. Talk at .NET Conf China 2021 on computer vision with OpenCV.',
    },
    link: 'https://github.com/sdcb/PaddleSharp',
    highlight: true,
  },
  {
    date: '2022',
    title: { zh: 'Sdcb.FFmpeg', en: 'Sdcb.FFmpeg' },
    body: {
      zh: '用 CppSharp 生成完整的 FFmpeg .NET API，并在 .NET Conf China 2022 上介绍。',
      en: 'A complete FFmpeg API for .NET generated with CppSharp, presented at .NET Conf China 2022.',
    },
    link: 'https://www.cnblogs.com/sdcb/p/dotnet-conf-china-2022-ffmpeg.html',
  },
  {
    date: '2023',
    title: { zh: 'OpenVINO.NET、Sdcb.Arithmetic、Sdcb.LibRaw', en: 'OpenVINO.NET, Sdcb.Arithmetic, Sdcb.LibRaw' },
    body: {
      zh: '高产的一年：Intel 推理、GMP/MPFR 高精度计算、相机 RAW 解析，以及一批国内大模型 SDK。',
      en: 'A prolific year: Intel inference, GMP/MPFR arbitrary precision, camera RAW — plus a batch of LLM SDKs.',
    },
    link: 'https://www.cnblogs.com/sdcb/p/20231015-sdcb-openvino-net.html',
  },
  {
    date: '2024',
    title: { zh: 'Sdcb Chats 开源', en: 'Sdcb Chats goes open source' },
    body: {
      zh: '一个面向企业私有化部署的大模型前端与 AI 网关，此后以极快的节奏迭代到 1.17。',
      en: 'An LLM front-end and AI gateway for self-hosting, followed by 17 minor releases at a relentless pace.',
    },
    link: 'https://www.cnblogs.com/sdcb/p/18597030/sdcb-chats-intro',
    highlight: true,
  },
  {
    date: '2025',
    title: { zh: 'MCP、C# Runner 与代码解释器', en: 'MCP, C# Runner and code interpreters' },
    body: {
      zh: '手撸 MCP 服务端、开源 csharp-runner，并把 ChatGPT 式“高级数据分析”带进 Chats。',
      en: 'A hand-rolled MCP server, the open-source csharp-runner, and ChatGPT-style data analysis inside Chats.',
    },
    link: 'https://www.cnblogs.com/sdcb/p/19003720/csharp-runner-mcp',
  },
  {
    date: '2026',
    title: { zh: 'SimdPaddleOCR：纯 C# 的推理引擎', en: 'SimdPaddleOCR: inference in pure C#' },
    body: {
      zh: '不再绑定任何原生推理库，手写 SIMD 内核和托管 ONNX 解释器，一个月内从 1.0 迭代到 1.4，2.0 开始支持 Vulkan / Metal GPU。同年发布纯 C# 翻译模型推理库 HyMT2Sharp。',
      en: 'No native inference runtime at all — hand-written SIMD kernels and a managed ONNX interpreter, 1.0 → 1.4 in a month, with Vulkan / Metal GPU in 2.0. HyMT2Sharp, a pure-C# translation LLM runtime, ships the same month.',
    },
    link: 'https://www.cnblogs.com/sdcb/p/22863347/20260907-simdpaddleocr-intro',
    highlight: true,
  },
];

export const talks: { date: string; event: L10n; title: L10n; link?: string }[] = [
  {
    date: '2021-12',
    event: { zh: '.NET Conf China 2021', en: '.NET Conf China 2021' },
    title: { zh: '.NET 玩转计算机视觉 OpenCV', en: 'Computer vision with OpenCV in .NET' },
    link: 'https://github.com/sdcb/dotnet-cv2021',
  },
  {
    date: '2022-12',
    event: { zh: '.NET Conf China 2022', en: '.NET Conf China 2022' },
    title: { zh: '我做的 FFmpeg 开源 C# 封装库 Sdcb.FFmpeg', en: 'Sdcb.FFmpeg: an open-source FFmpeg wrapper for C#' },
    link: 'https://www.cnblogs.com/sdcb/p/dotnet-conf-china-2022-ffmpeg.html',
  },
  {
    date: '2024-02',
    event: { zh: '.NET Conf 长沙站', en: '.NET Conf Changsha' },
    title: { zh: '.NET骚操作·挑战非传统领域', en: '.NET beyond its comfort zone' },
    link: 'https://www.bilibili.com/video/BV1Qy421z7fk',
  },
];
