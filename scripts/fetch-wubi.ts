// Pulls a few real decompositions from https://wubi.sdcb.ai into src/data/wubi-demo.json for the /wubi page demo.
// Run manually (`npm run fetch-wubi`) and commit the output; the site build never depends on it.
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BASE = 'https://wubi.sdcb.ai/data';
const CHARS = ['胜', '露', '鼎', '雨', '国'];
const STROKE_NAMES = ['', '横', '竖', '撇', '点', '折'];
const STROKE_NAMES_EN = ['', 'heng', 'shu', 'pie', 'dian', 'zhe'];

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/wubi-demo.json');

type Rec = {
  codes: [string, number, number][];
  py?: string;
  ss?: string;
  full?: string;
  t?: number;
  r?: string[];
  idu?: string;
  flag?: string;
  s?: string[];
  seg?: number[][];
  q?: string;
};
type Root = { k: string; p: string; n: string; a?: string };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`${res.status} <- ${path}`);
  return (await res.json()) as T;
}

const meta = await get<Record<string, unknown>>('meta.json');
const roots = await get<Record<string, Root>>('roots.json');

const chars = [];
for (const ch of CHARS) {
  const shard = await get<Record<string, Rec>>(`c/${(ch.codePointAt(0)! >> 4).toString(16)}.json`);
  const rec = shard[ch];
  if (!rec?.s || !rec.full || !rec.r) throw new Error(`no decomposition for ${ch}`);
  const n = rec.s.length;
  const all = [...Array(n).keys()];
  const glyph = (id?: string) => (id ? roots[id]?.p ?? '' : '');
  const name = (id?: string) => (id ? roots[id]?.n || roots[id]?.a || '' : '');
  const strokeColor: number[] = Array(n).fill(rec.t ? 0 : -1);
  let parts;
  if (rec.t === 2) {
    const picks = [0, 1, n - 1];
    const zh = ['首笔', '次笔', '末笔'];
    const en = ['1st', '2nd', 'last'];
    parts = [...rec.full].map((letter, i) => {
      if (i === 0) return { letter, zh: '报户口', en: 'the root itself', glyph: glyph(rec.r![0]), strokes: all, color: 0 };
      const s = picks[i - 1];
      const tp = Number(rec.ss?.[s] ?? 0);
      return { letter, zh: `${zh[i - 1]}·${STROKE_NAMES[tp]}`, en: `${en[i - 1]} · ${STROKE_NAMES_EN[tp]}`, glyph: '', strokes: [s], color: i };
    });
  } else if (rec.t === 0 || rec.t === undefined) {
    parts = rec.r.map((id, i) => {
      (rec.seg?.[i] ?? []).forEach((s) => (strokeColor[s] = i));
      return { letter: rec.full![i], zh: name(id) || '字根', en: name(id) || 'root', glyph: glyph(id), strokes: rec.seg?.[i] ?? [], color: i };
    });
    if (rec.idu && rec.full.length > rec.r.length) {
      parts.push({ letter: rec.full[rec.r.length], zh: '识别码', en: 'ID code', glyph: glyph(rec.idu), strokes: [n - 1], color: 4 });
    }
  } else {
    throw new Error(`unsupported type ${rec.t} for ${ch}`);
  }
  chars.push({ ch, py: rec.py ?? '', full: rec.full, codes: rec.codes.map(([c, rank]) => [c, rank]), flag: rec.flag ?? '', strokes: rec.s, strokeColor, parts });
}

await writeFile(out, JSON.stringify({ fetchedAt: new Date().toISOString(), meta, chars }));
console.log(`wrote ${out}`);
