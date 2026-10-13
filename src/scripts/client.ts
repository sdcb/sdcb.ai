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

// wubi split demo (/wubi)
document.querySelectorAll<HTMLElement>('[data-wubi]').forEach((root) => {
  const picks = root.querySelectorAll<HTMLButtonElement>('[data-wubi-pick]');
  const panels = root.querySelectorAll<HTMLElement>('[data-wubi-panel]');
  let timer: number | undefined;
  let autoplayed = false;

  const paint = (panel: HTMLElement, fn: (p: SVGPathElement, i: number, base: number) => [string, number]) =>
    panel.querySelectorAll<SVGPathElement>('[data-stroke]').forEach((p, i) => {
      const [color, opacity] = fn(p, i, Number(p.dataset.color));
      p.style.fill = `var(--wb-${color})`;
      p.style.opacity = String(opacity);
    });
  const reset = (panel: HTMLElement) => {
    window.clearInterval(timer);
    panel.querySelectorAll('[data-active]').forEach((el) => el.removeAttribute('data-active'));
    paint(panel, (_, __, c) => [c < 0 ? 'off' : String(c), 1]);
  };
  const highlight = (panel: HTMLElement, strokes: Set<number>, color: string) =>
    paint(panel, (_, i) => (strokes.has(i) ? [color, 1] : ['off', 0.45]));

  const play = (panel: HTMLElement, kind: string) => {
    reset(panel);
    const parts = [...panel.querySelectorAll<HTMLElement>('[data-wubi-part]')].filter((b) => b.dataset.strokes && b.dataset.color !== '4');
    const total = kind === 'split' ? parts.length : panel.querySelectorAll('[data-stroke]').length;
    let step = 0;
    const frame = () => {
      if (kind === 'split') {
        const lit = new Map<number, string>();
        parts.forEach((b, k) => {
          b.toggleAttribute('data-active', k === step - 1);
          if (k < step) b.dataset.strokes!.split(',').forEach((s) => lit.set(Number(s), b.dataset.color!));
        });
        paint(panel, (_, i) => (lit.has(i) ? [lit.get(i)!, 1] : ['off', 0.25]));
      } else {
        paint(panel, (_, i, c) => [c < 0 ? 'off' : String(c), i < step ? 1 : 0]);
      }
    };
    frame();
    timer = window.setInterval(
      () => {
        if (++step > total + 1) return reset(panel);
        frame();
      },
      kind === 'split' ? 900 : 380,
    );
  };

  panels.forEach((panel) => {
    panel.querySelectorAll<HTMLElement>('[data-wubi-part]').forEach((b) => {
      const on = () => {
        window.clearInterval(timer);
        highlight(panel, new Set(b.dataset.strokes!.split(',').filter(Boolean).map(Number)), b.dataset.color!);
      };
      b.addEventListener('mouseenter', on);
      b.addEventListener('focus', on);
      b.addEventListener('click', on);
      b.addEventListener('mouseleave', () => reset(panel));
      b.addEventListener('blur', () => reset(panel));
    });
    panel.querySelectorAll<HTMLButtonElement>('[data-wubi-play]').forEach((b) => b.addEventListener('click', () => play(panel, b.dataset.wubiPlay!)));
  });

  picks.forEach((btn) =>
    btn.addEventListener('click', () => {
      picks.forEach((x) => x.setAttribute('aria-selected', String(x === btn)));
      panels.forEach((p) => {
        reset(p);
        p.hidden = p.dataset.wubiPanel !== btn.dataset.wubiPick;
      });
      play(panels[Number(btn.dataset.wubiPick)], 'split');
    }),
  );

  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new IntersectionObserver((entries, io) => {
      if (autoplayed || !entries.some((e) => e.isIntersecting)) return;
      autoplayed = true;
      io.disconnect();
      window.setTimeout(() => play(panels[0], 'split'), 500);
    }).observe(root);
  }
});

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
