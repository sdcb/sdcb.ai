export type Lang = 'zh' | 'en';
export type L10n = { zh: string; en: string };

export const langs: Lang[] = ['zh', 'en'];

export function t(lang: Lang, text: L10n): string {
  return text[lang];
}

/** `path` is the zh (root) path, e.g. `/projects`. */
export function href(lang: Lang, path: string): string {
  if (lang === 'zh') return path;
  return path === '/' ? '/en/' : `/en${path}`;
}

/** Maps the current URL pathname to its counterpart in the other language. */
export function switchPath(pathname: string, to: Lang): string {
  const base = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return href(to, base);
}

export function fmtNumber(n: number, lang: Lang): string {
  if (lang === 'zh') {
    if (n >= 1e8) return `${+(n / 1e8).toFixed(1)} 亿`;
    if (n >= 1e4) return `${+(n / 1e4).toFixed(1)} 万`;
    return n.toLocaleString('zh-CN');
  }
  if (n >= 1e6) return `${+(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${+(n / 1e3).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}

export function fmtDate(iso: string, lang: Lang, withDay = true): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: lang === 'zh' ? 'numeric' : 'short',
    ...(withDay ? { day: 'numeric' } : {}),
    timeZone: 'Asia/Shanghai',
  });
}

export const nav: { path: string; label: L10n }[] = [
  { path: '/simdpaddleocr', label: { zh: 'SimdPaddleOCR', en: 'SimdPaddleOCR' } },
  { path: '/chats', label: { zh: 'Chats', en: 'Chats' } },
  { path: '/projects', label: { zh: '开源项目', en: 'Projects' } },
  { path: '/writing', label: { zh: '文章', en: 'Writing' } },
  { path: '/about', label: { zh: '关于', en: 'About' } },
  { path: '/community', label: { zh: '社区', en: 'Community' } },
];
