import type { L10n } from '../i18n';

export type Category = 'inference' | 'ai-app' | 'sdk' | 'media' | 'compute' | 'dev' | 'fun';

export const categories: { id: Category; label: L10n; blurb: L10n }[] = [
  {
    id: 'inference',
    label: { zh: 'AI 推理引擎', en: 'AI inference' },
    blurb: { zh: '把模型跑在 .NET 里：从绑定原生库，到纯 C# 自研推理。', en: 'Running models inside .NET — from native bindings to pure-C# engines.' },
  },
  {
    id: 'ai-app',
    label: { zh: 'AI 应用与网关', en: 'AI apps & gateways' },
    blurb: { zh: '面向真实用户的 AI 产品与基础设施。', en: 'AI products and infrastructure for real users.' },
  },
  {
    id: 'sdk',
    label: { zh: '大模型 SDK', en: 'LLM SDKs' },
    blurb: { zh: '国内大模型平台的非官方 .NET SDK。', en: 'Unofficial .NET SDKs for Chinese LLM platforms.' },
  },
  {
    id: 'media',
    label: { zh: '图像、多媒体与渲染', en: 'Imaging, media & graphics' },
    blurb: { zh: '音视频、RAW 照片、2D 渲染——AI 的数据入口。', en: 'Video, RAW photos, 2D rendering — where AI data comes from.' },
  },
  {
    id: 'compute',
    label: { zh: '数值与科学计算', en: 'Numerics & science' },
    blurb: { zh: '高精度算术和物理模拟。', en: 'Arbitrary precision math and physics simulation.' },
  },
  {
    id: 'dev',
    label: { zh: '开发者工具', en: 'Developer tools' },
    blurb: { zh: '写给自己、也写给同行的工具。', en: 'Tools I built for myself and fellow developers.' },
  },
  {
    id: 'fun',
    label: { zh: '游戏与趣味', en: 'Games & toys' },
    blurb: { zh: '工作之外的骚操作。', en: 'Side quests.' },
  },
];

export type Project = {
  repo: string;
  name?: string;
  category: Category;
  tagline: L10n;
  tags?: string[];
  nuget?: string[];
  docker?: string[];
  page?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    repo: 'SimdPaddleOCR',
    category: 'inference',
    featured: true,
    page: '/simdpaddleocr',
    tagline: {
      zh: '纯 C# 的 PP-OCRv6 推理库：手写 SIMD Kernel 与 GEMM，自带托管 ONNX 解释器，零原生依赖；2.0 起支持 Vulkan / Metal GPU。',
      en: 'Pure-C# PP-OCRv6 inference: hand-written SIMD kernels and GEMM, a managed ONNX interpreter, zero native deps. 2.0 adds Vulkan / Metal GPU.',
    },
    tags: ['OCR', 'SIMD', 'AVX-512', 'NEON', 'Vulkan', 'Metal', 'NativeAOT'],
    nuget: ['Sdcb.SimdPaddleOCR'],
  },
  {
    repo: 'PaddleSharp',
    category: 'inference',
    featured: true,
    tagline: {
      zh: '百度飞桨 Paddle Inference 的 .NET 绑定，PaddleOCR、PaddleDetection 等能力开箱即用，是 .NET 下最流行的 OCR 方案之一。',
      en: '.NET bindings for Baidu Paddle Inference — PaddleOCR, PaddleDetection and more, out of the box. One of the most popular OCR stacks in .NET.',
    },
    tags: ['OCR', 'Paddle', 'Detection'],
    nuget: ['Sdcb.PaddleInference', 'Sdcb.PaddleOCR', 'Sdcb.PaddleDetection', 'Sdcb.RotationDetector', 'Sdcb.PaddleNLP', 'Sdcb.Paddle2Onnx', 'Sdcb.Mkldnn'],
  },
  {
    repo: 'OpenVINO.NET',
    category: 'inference',
    featured: true,
    tagline: {
      zh: 'Intel OpenVINO™ 工具套件的高质量 .NET 封装，让 CPU / iGPU 上的推理又快又省。',
      en: 'A high-quality .NET wrapper for the Intel OpenVINO™ toolkit — fast, frugal inference on CPUs and iGPUs.',
    },
    tags: ['OpenVINO', 'Intel', 'YOLO'],
    nuget: ['Sdcb.OpenVINO'],
  },
  {
    repo: 'HyMT2Sharp',
    category: 'inference',
    tagline: {
      zh: '纯 C# 的腾讯混元翻译大模型 Hy-MT2 CPU 推理实现，不依赖 llama.cpp，本地离线翻译。',
      en: 'Pure-C# CPU inference for Tencent Hunyuan MT2 translation model — no llama.cpp, fully offline.',
    },
    tags: ['LLM', 'Translation', 'GGUF'],
    nuget: ['Sdcb.HyMT2Sharp'],
  },
  {
    repo: 'opencvsharp-mini-runtime',
    category: 'inference',
    tagline: {
      zh: '面向服务端模型推理的 OpenCvSharp 迷你运行时，体积小、全平台。',
      en: 'A slim OpenCvSharp runtime tailored for server-side inference, on every platform.',
    },
    tags: ['OpenCV', 'Runtime'],
    nuget: ['Sdcb.OpenCvSharp4'],
  },
  {
    repo: 'chats',
    name: 'Sdcb Chats',
    category: 'ai-app',
    featured: true,
    page: '/chats',
    tagline: {
      zh: '强大灵活的大模型前端与 AI 网关：22+ 模型服务商、代码解释器、兼容 Chat Completions / Messages / Responses 协议，支持 Claude Code。',
      en: 'A powerful LLM front-end and AI gateway: 22+ providers, code interpreter, Chat Completions / Messages / Responses compatible, works with Claude Code.',
    },
    tags: ['LLM', 'Gateway', 'React', 'Docker'],
    docker: ['chats'],
  },
  {
    repo: 'csharp-runner',
    category: 'ai-app',
    tagline: {
      zh: '快速、安全的 C# 代码运行器，为大模型 MCP Code Interpreter 而生。',
      en: 'A fast, sandboxed C# runner built for LLM code interpreters over MCP.',
    },
    tags: ['MCP', 'Sandbox'],
    docker: ['csharp-runner-host', 'csharp-runner-worker'],
  },
  {
    repo: 'code-pod',
    category: 'ai-app',
    tagline: {
      zh: '基于 Docker 的 AI 代码解释器管理平台，为大模型提供安全隔离的执行与数据分析环境。',
      en: 'Docker-based code-interpreter platform giving LLMs isolated containers for execution and data analysis.',
    },
    tags: ['Docker', 'Code Interpreter'],
  },
  {
    repo: 'xiaomimimo-for-copilot',
    category: 'ai-app',
    tagline: {
      zh: '在 VS Code Copilot Chat 的模型选择器里直接使用小米 MiMo 模型，思考模式、视觉、Agent 工具零配置可用。',
      en: 'Pick Xiaomi MiMo models right from the Copilot Chat model picker — thinking, vision and agent tools, zero config.',
    },
    tags: ['VS Code', 'Copilot'],
  },
  {
    repo: 'Sdcb.DashScope',
    category: 'sdk',
    tagline: { zh: '阿里云灵积模型服务 DashScope 的非官方 .NET SDK。', en: 'Unofficial .NET SDK for Alibaba Cloud DashScope.' },
    nuget: ['Sdcb.DashScope'],
  },
  {
    repo: 'Sdcb.SparkDesk',
    category: 'sdk',
    tagline: { zh: '讯飞星火大模型的非官方 .NET SDK。', en: 'Unofficial .NET SDK for iFlytek SparkDesk.' },
    nuget: ['Sdcb.SparkDesk'],
  },
  {
    repo: 'Sdcb.WenXinQianFan',
    category: 'sdk',
    tagline: { zh: '百度文心千帆平台的非官方 .NET SDK。', en: 'Unofficial .NET SDK for Baidu Qianfan (ERNIE).' },
    nuget: ['Sdcb.WenXinQianFan'],
  },
  {
    repo: 'Sdcb.StabilityAI',
    category: 'sdk',
    tagline: { zh: 'Stability AI REST API 的非官方 C# SDK。', en: 'Unofficial C# SDK for the Stability AI REST API.' },
    nuget: ['Sdcb.StabilityAI'],
  },
  {
    repo: 'Sdcb.FFmpeg',
    category: 'media',
    featured: true,
    tagline: {
      zh: '由 CppSharp 生成的 FFmpeg 底层 .NET API，音视频编解码、滤镜、封装一应俱全。',
      en: 'Low-level FFmpeg API for .NET generated by CppSharp — decoding, encoding, filters, muxing.',
    },
    tags: ['FFmpeg', 'Video', 'Audio'],
    nuget: ['Sdcb.FFmpeg'],
  },
  {
    repo: 'Sdcb.LibRaw',
    category: 'media',
    tagline: { zh: '基于 LibRaw 的 C# 相机 RAW 照片处理库。', en: 'Camera RAW processing in C#, powered by LibRaw.' },
    tags: ['RAW', 'Photography'],
    nuget: ['Sdcb.LibRaw'],
  },
  {
    repo: 'Sdcb.WordCloud',
    category: 'media',
    tagline: { zh: '在 .NET 中生成词云图片，纯托管、跨平台。', en: 'Generate word-cloud images in .NET — managed and cross-platform.' },
    nuget: ['Sdcb.WordCloud'],
  },
  {
    repo: 'FlysEngine',
    category: 'media',
    tagline: { zh: '基于 Direct2D 的实时 2D 渲染工具库。', en: 'Real-time 2D rendering utilities on Direct2D.' },
    tags: ['Direct2D'],
    nuget: ['FlysEngine'],
  },
  {
    repo: 'Sdcb.ScreenCapture',
    category: 'media',
    tagline: { zh: '基于 Desktop Duplication 的高性能 Windows 截屏库。', en: 'High-performance Windows screen capture via Desktop Duplication.' },
    nuget: ['Sdcb.ScreenCapture'],
  },
  {
    repo: 'Sdcb.Arithmetic',
    category: 'compute',
    featured: true,
    tagline: {
      zh: '通过 P/Invoke 连接 GMP 与 MPFR 的现代 .NET 高精度算术库，兼顾极致性能与 .NET 的易用性。',
      en: 'A modern .NET library over GMP and MPFR — arbitrary precision with native speed and .NET ergonomics.',
    },
    tags: ['GMP', 'MPFR', 'BigInteger'],
    nuget: ['Sdcb.Arithmetic'],
  },
  {
    repo: 'n-body',
    category: 'compute',
    tagline: { zh: '用 C# 模拟 N 体问题，看见天体运动的混沌之美。', en: 'N-body simulation in C# — the chaotic beauty of celestial motion.' },
  },
  {
    repo: 'sdmap',
    category: 'dev',
    tagline: {
      zh: '编写动态 SQL 的模板引擎，NuGet 下载超过十万次。',
      en: 'A template engine for dynamic SQL, with 100k+ NuGet downloads.',
    },
    tags: ['SQL', 'Template'],
    nuget: ['sdmap'],
  },
  {
    repo: 'blog-data',
    category: 'dev',
    tagline: { zh: '《.NET骚操作》博客的全部示例代码（多为 LINQPad 脚本）。', en: 'All sample code behind the “.NET骚操作” blog, mostly LINQPad scripts.' },
  },
  {
    repo: 'mini-winform',
    category: 'dev',
    tagline: { zh: '为 .NET Native AOT 小工具打造的迷你 Win32 GUI 工具包。', en: 'A tiny Win32 GUI toolkit for .NET Native AOT utilities.' },
    nuget: ['Sdcb.MiniWinForm'],
  },
  {
    repo: 'blade',
    category: 'fun',
    tagline: { zh: '旋刃竞技场，一个浏览器小游戏。', en: 'Spinning-blade arena — a small browser game.' },
  },
  {
    repo: 'hanzi-slider',
    category: 'fun',
    tagline: { zh: '给孩子玩的汉字偏旁组合“抽抽乐”，带声调拼音。', en: 'A radical-mixing Chinese character toy for kids, with pinyin.' },
  },
  {
    repo: '2019-ncp-simulation',
    category: 'fun',
    tagline: { zh: '用 C# 模拟 2020 年初的疫情传播。', en: 'Simulating the early-2020 epidemic spread in C#.' },
  },
  {
    repo: 'sorry',
    category: 'fun',
    tagline: { zh: '用 ASP.NET Core 和 Sdcb.FFmpeg 生成“为所欲为”表情包 GIF。', en: 'Meme GIF generator with ASP.NET Core and Sdcb.FFmpeg.' },
  },
];
