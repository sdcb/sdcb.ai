import type { L10n } from '../i18n';

export type RoadmapTheme = { id: string; icon: string; title: L10n; pitch: L10n; items: L10n[] };

export const roadmap: RoadmapTheme[] = [
  {
    id: 'workspace',
    icon: 'box',
    title: { zh: '持久化 Docker 工作区', en: 'Persistent Docker workspaces' },
    pitch: {
      zh: 'Docker 不再只活在一次对话里：上次配置好的环境，下次对话接着用。',
      en: 'Containers outlive a single chat — the environment you set up last time is still there next time.',
    },
    items: [
      { zh: '跨会话保留的 Docker，同时保留现有的临时会话级 Docker', en: 'Long-lived containers alongside today’s per-session ones' },
      { zh: '独立数据卷（Volume），数据库等数据不必放在容器里', en: 'Dedicated volumes, so databases don’t live inside the container' },
      { zh: '每次对话由用户选择向 AI 开放哪些 Docker', en: 'Per-chat choice of which containers the AI may see' },
      { zh: '按 CPU、内存、网络、容器数量配额，管理员不受限', en: 'Quotas on CPU, memory, network and container count; admins unlimited' },
      { zh: '统一管理入口：用户看自己的，管理员看全部', en: 'One console: users see theirs, admins see everyone’s' },
    ],
  },
  {
    id: 'hosting',
    icon: 'globe',
    title: { zh: '一句话把网站发上线', en: 'Ship a website from the chat' },
    pitch: {
      zh: '对 AI 说“要能外网访问，用这个子域名”，网站就上线了。',
      en: 'Tell the AI “make it public on this subdomain” — and it’s live.',
    },
    items: [
      { zh: '由 Docker 直接承载网站，流量经网关进入', en: 'Containers serve the site; traffic enters through the gateway' },
      { zh: '通过 API 配置 Caddy 2 网关与端口映射', en: 'Caddy 2 gateway and port mapping configured over its API' },
      { zh: '抽象的 DNS 能力，首批支持阿里云 DNS 与 Cloudflare DNS', en: 'Pluggable DNS, starting with Alibaba Cloud DNS and Cloudflare' },
    ],
  },
  {
    id: 'agent',
    icon: 'message',
    title: { zh: '会提问、能插话的 Agent', en: 'An agent that asks — and listens' },
    pitch: {
      zh: '该问的时候先问清楚，跑到一半也能随时补充想法。',
      en: 'It asks when things are unclear, and you can chime in mid-run.',
    },
    items: [
      { zh: 'Ask Question：一次可问多个澄清问题，用户作答后 ReAct 循环继续', en: 'Ask Question: several clarifying questions at once; the ReAct loop resumes on answer' },
      {
        zh: '计划 / 需求澄清模式：遇到不清楚的必须先问；正常模式则力求一次搞定',
        en: 'Plan / clarify mode must ask about unknowns; normal mode aims to finish in one go',
      },
      { zh: '中途插话：无需停止，下一次工具调用结束后自动插入你的补充', en: 'Steering: no need to stop — your note is injected after the next tool call' },
    ],
  },
  {
    id: 'files',
    icon: 'image',
    title: { zh: '有状态的文件与图片', en: 'Stateful files & images' },
    pitch: {
      zh: '图片只传一次，多轮对话直接引用模型提供商的文件 ID。',
      en: 'Upload an image once; later turns reference the provider’s file ID.',
    },
    items: [
      {
        zh: '上传时同时写入自有文件服务与支持文件 ID 的模型提供商',
        en: 'Uploads go to our own storage and to providers that support file IDs',
      },
      {
        zh: '后续轮次不再重复发送 Base64 或 URL，多轮图片对话显著提速',
        en: 'No more re-sending Base64 or URLs — much faster multi-turn image chats',
      },
      { zh: '覆盖 Responses、Anthropic Messages、Chat Completions，并妥善处理文件过期', en: 'Across Responses, Anthropic Messages and Chat Completions, with expiry handled' },
    ],
  },
  {
    id: 'resume',
    icon: 'zap',
    title: { zh: '刷新也不断的流式响应', en: 'Streams that survive a refresh' },
    pitch: {
      zh: '刷新页面后，依然能看到 AI 在继续干活，也依然能叫停它。',
      en: 'Reload the page and the AI is still visibly at work — and still stoppable.',
    },
    items: [
      { zh: '流式（SSE）过程持久化到数据库，刷新后无缝续上', en: 'SSE progress persisted to the database and replayed on reload' },
      { zh: '停止标识同样持久化，刷新后也能停止对话', en: 'Stop tokens persisted too, so Stop works after a refresh' },
      { zh: '会话完成后定期清理，不占额外空间', en: 'Cleaned up periodically once a turn completes' },
    ],
  },
];

export const watching: L10n = {
  zh: '在观察：子代理（Subagent）。方向很有意思，但速度和可控性优先，暂不纳入 2.0。',
  en: 'Watching: subagents. Interesting, but speed and control come first — not part of 2.0.',
};
