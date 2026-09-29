import { fmtNumber, type Lang } from '../i18n';

const lang: Lang = document.documentElement.lang.startsWith('zh') ? 'zh' : 'en';

// theme
document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) =>
  btn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
  }),
);

// mobile menu
const menuBtn = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const menu = document.querySelector<HTMLElement>('[data-menu]');
menuBtn?.addEventListener('click', () => {
  const open = menu!.classList.toggle('hidden') === false;
  menuBtn.setAttribute('aria-expanded', String(open));
});

// remember explicit language choice
document.querySelectorAll<HTMLAnchorElement>('[data-lang-switch]').forEach((a) =>
  a.addEventListener('click', () => localStorage.setItem('lang', a.dataset.langSwitch!)),
);

// suggest the English site once to browsers that don't prefer Chinese
const switcher = document.querySelector<HTMLAnchorElement>('[data-lang-switch="en"]');
if (
  lang === 'zh' &&
  switcher &&
  !localStorage.getItem('lang') &&
  !navigator.languages.some((l) => l.toLowerCase().startsWith('zh'))
) {
  const bar = document.createElement('div');
  bar.className =
    'fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-xl border border-line-strong bg-surface/95 px-4 py-3 text-sm shadow-2xl backdrop-blur';
  bar.innerHTML = `<span class="flex-1">This site is also available in English.</span>
    <a class="btn-primary px-3 py-1.5 text-xs" href="${switcher.href}">English</a>
    <button type="button" class="text-fg-mute hover:text-fg" aria-label="Dismiss">✕</button>`;
  bar.querySelector('a')!.addEventListener('click', () => localStorage.setItem('lang', 'en'));
  bar.querySelector('button')!.addEventListener('click', () => {
    localStorage.setItem('lang', 'zh');
    bar.remove();
  });
  document.body.append(bar);
}

// copy buttons
document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) =>
  btn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(btn.dataset.copy!);
    const label = btn.querySelector('[data-copy-label]');
    const prev = label?.textContent;
    btn.dataset.copied = '';
    if (label) label.textContent = lang === 'zh' ? '已复制' : 'Copied';
    setTimeout(() => {
      delete btn.dataset.copied;
      if (label && prev) label.textContent = prev;
    }, 1600);
  }),
);

// tabs
document.querySelectorAll<HTMLElement>('[data-tabs]').forEach((root) => {
  const tabs = root.querySelectorAll<HTMLButtonElement>('[data-tab]');
  const panels = root.querySelectorAll<HTMLElement>('[data-panel]');
  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === tab)));
      panels.forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    }),
  );
});

// dialogs (QR codes etc.)
document.querySelectorAll<HTMLElement>('[data-dialog-open]').forEach((el) =>
  el.addEventListener('click', () => {
    document.querySelector<HTMLDialogElement>(`#${el.dataset.dialogOpen}`)?.showModal();
  }),
);
document.querySelectorAll<HTMLDialogElement>('dialog').forEach((d) =>
  d.addEventListener('click', (e) => {
    if (e.target === d || (e.target as HTMLElement).closest('[data-dialog-close]')) d.close();
  }),
);

// reveal on scroll
const reveal = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      (e.target as HTMLElement).dataset.revealed = '';
      reveal.unobserve(e.target);
    }
  },
  { rootMargin: '0px 0px -8% 0px' },
);
document.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

// live stats: server-rendered numbers are a build-time snapshot, refresh them from the edge
function format(n: number, fmt: string | undefined) {
  if (fmt === 'short') return fmtNumber(n, 'en');
  if (fmt === 'full') return n.toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US');
  return fmtNumber(n, lang);
}

type LiveStats = {
  totals: Record<string, number>;
  repos: Record<string, number>;
};

if (document.querySelector('[data-stat],[data-repo-stars]')) {
  fetch('/api/stats')
    .then((r) => (r.ok ? (r.json() as Promise<LiveStats>) : Promise.reject(r.status)))
    .then((s) => {
      document.querySelectorAll<HTMLElement>('[data-stat]').forEach((el) => {
        const v = s.totals[el.dataset.stat!];
        if (typeof v === 'number' && v > 0) el.textContent = format(v, el.dataset.format);
      });
      document.querySelectorAll<HTMLElement>('[data-repo-stars]').forEach((el) => {
        const v = s.repos[el.dataset.repoStars!.toLowerCase()];
        if (typeof v === 'number') el.textContent = format(v, el.dataset.format ?? 'short');
      });
    })
    .catch(() => {
      /* keep snapshot values */
    });
}
