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

// HyMT2Sharp translation race (/hymt2sharp)
document.querySelectorAll<HTMLElement>('[data-hymt]').forEach((root) => {
  type Speed = { pp: number; tg: number } | null;
  const data: { prompt: number; output: number; text: string; quants: Record<string, Record<string, Speed>> } = JSON.parse(root.dataset.hymtData!);
  const chars = Array.from(data.text);
  const chunks = Array.from({ length: data.output }, (_, i) =>
    chars.slice(Math.floor((i * chars.length) / data.output), Math.floor(((i + 1) * chars.length) / data.output)).join(''),
  );
  const tabs = root.querySelectorAll<HTMLButtonElement>('[data-hymt-q]');
  const panels = root.querySelectorAll<HTMLElement>('[data-hymt-panel]');
  const laneEls = [...root.querySelectorAll<HTMLElement>('[data-hymt-lane]')];
  let quant = [...tabs].find((t) => t.getAttribute('aria-selected') === 'true')!.dataset.hymtQ!;
  let raf = 0;
  let started = false;

  const q = (lane: HTMLElement, sel: string) => lane.querySelector<HTMLElement>(sel)!;
  const run = () => {
    cancelAnimationFrame(raf);
    started = true;
    const speeds = data.quants[quant];
    const lanes = laneEls.map((el) => {
      const s = speeds[el.dataset.hymtLane!];
      q(el, '[data-hymt-na]').hidden = !!s;
      q(el, '[data-hymt-rank]').hidden = true;
      q(el, '[data-hymt-out]').textContent = '';
      q(el, '[data-hymt-pp]').style.width = '0';
      q(el, '[data-hymt-tg]').style.width = '0';
      q(el, '[data-hymt-meta]').textContent = s ? '0 ms' : '—';
      el.style.opacity = s ? '' : '0.55';
      return { el, s, ppMs: s ? (data.prompt / s.pp) * 1000 : 0, done: !s, shown: -1 };
    });
    let rank = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = now - t0;
      for (const l of lanes) {
        if (l.done || !l.s) continue;
        const ppFrac = Math.min(1, t / l.ppMs);
        const n = t < l.ppMs ? 0 : Math.min(data.output, Math.floor(((t - l.ppMs) / 1000) * l.s.tg));
        // prefill gets 20% of the bar so it stays visible even when it takes 5 ms
        q(l.el, '[data-hymt-pp]').style.width = `${ppFrac * 20}%`;
        q(l.el, '[data-hymt-tg]').style.width = `${(n / data.output) * 80}%`;
        if (n !== l.shown) {
          l.shown = n;
          q(l.el, '[data-hymt-out]').textContent = chunks.slice(0, n).join('');
        }
        if (n >= data.output) {
          l.done = true;
          const total = l.ppMs + (data.output / l.s.tg) * 1000;
          q(l.el, '[data-hymt-meta]').textContent = `${Math.round(total).toLocaleString('en')} ms · ${l.s.tg} tok/s`;
          const badge = q(l.el, '[data-hymt-rank]');
          badge.textContent = `#${++rank}`;
          badge.hidden = false;
        } else {
          q(l.el, '[data-hymt-meta]').textContent = `${Math.round(t).toLocaleString('en')} ms`;
        }
      }
      if (lanes.some((l) => !l.done)) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };

  tabs.forEach((tab) =>
    tab.addEventListener('click', () => {
      quant = tab.dataset.hymtQ!;
      tabs.forEach((x) => x.setAttribute('aria-selected', String(x === tab)));
      panels.forEach((p) => (p.hidden = p.dataset.hymtPanel !== quant));
      run();
    }),
  );
  root.querySelector('[data-hymt-run]')?.addEventListener('click', run);

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  new IntersectionObserver(
    (entries, io) => {
      if (started || !entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      if (reduced) {
        laneEls.forEach((el) => {
          const s = data.quants[quant][el.dataset.hymtLane!];
          q(el, '[data-hymt-na]').hidden = !!s;
          if (s) q(el, '[data-hymt-out]').textContent = data.text;
        });
      } else window.setTimeout(run, 300);
    },
    { threshold: 0.3 },
  ).observe(root);
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
