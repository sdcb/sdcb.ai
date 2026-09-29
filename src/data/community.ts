import type { L10n } from '../i18n';

export const qqGroups: { id: string; name: L10n; topic: L10n; link?: string }[] = [
  {
    id: '495782587',
    name: { zh: '.NET骚操作交流群', en: '.NET骚操作 (general .NET)' },
    topic: { zh: 'C# / .NET 综合技术交流、博客讨论', en: 'General C# / .NET chat and blog discussion' },
    link: 'https://qm.qq.com/q/1RDru3lIn6',
  },
  {
    id: '579060605',
    name: { zh: 'C#/.NET 计算机视觉技术交流', en: 'C#/.NET Computer Vision' },
    topic: { zh: 'SimdPaddleOCR、PaddleSharp、OpenVINO.NET、OpenCvSharp', en: 'SimdPaddleOCR, PaddleSharp, OpenVINO.NET, OpenCvSharp' },
    link: 'https://qm.qq.com/q/bPw5jAK4qk',
  },
  {
    id: '498452653',
    name: { zh: 'Sdcb Chats 交流群', en: 'Sdcb Chats' },
    topic: { zh: 'Chats 部署、使用、AI 网关与大模型', en: 'Chats deployment, AI gateway and LLMs' },
    link: 'https://qm.qq.com/q/NxEZkzjf0G',
  },
];

/** WeChat group QR codes rotate weekly; the image at `qr` is refreshed in place upstream. One QR serves several groups. */
export const wechatGroups: { key: string; name: L10n; groups: L10n[]; qr: string; fallbackQQ: string }[] = [
  {
    key: 'ocr',
    name: { zh: 'SimdPaddleOCR 与 .NET骚操作微信群', en: 'SimdPaddleOCR & .NET骚操作' },
    groups: [
      { zh: 'SimdPaddleOCR 1 群', en: 'SimdPaddleOCR #1' },
      { zh: 'SimdPaddleOCR 2 群', en: 'SimdPaddleOCR #2' },
      { zh: '.NET骚操作群', en: '.NET骚操作' },
    ],
    qr: 'https://io.starworks.cc:88/cv-public/2026/ocr-wxg-qr.png',
    fallbackQQ: '579060605',
  },
  {
    key: 'chats',
    name: { zh: 'Sdcb Chats 微信群', en: 'Sdcb Chats' },
    groups: [
      { zh: 'Chats 交流群 1 群', en: 'Chats #1' },
      { zh: 'Chats 交流群 2 群', en: 'Chats #2' },
    ],
    qr: 'https://io.starworks.cc:88/cv-public/2026/chats-wxg-qr.png',
    fallbackQQ: '498452653',
  },
];

export const officialAccount = {
  name: '.NET骚操作',
  qr: 'https://img2018.cnblogs.com/blog/233608/201908/233608-20190825165420518-990227633.jpg',
};
