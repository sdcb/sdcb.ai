// Fetches public stats (GitHub / NuGet / Docker Hub / cnblogs) into src/data/generated/snapshot.json.
// Each source degrades independently to src/data/fallback.json so the build never fails on a flaky upstream.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outFile = resolve(root, 'src/data/generated/snapshot.json');
const fallbackFile = resolve(root, 'src/data/fallback.json');

const GH_USER = 'sdcb';
const NUGET_OWNER = 'sdflysha';
const DOCKER_NS = 'sdcb';
const CNBLOGS = 'sdcb';
const RELEASE_REPOS = ['SimdPaddleOCR', 'chats', 'PaddleSharp', 'OpenVINO.NET', 'HyMT2Sharp', 'Sdcb.FFmpeg'];
const HISTORY_REPOS = ['chats', 'SimdPaddleOCR'];

type Repo = {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  pushedAt: string;
  createdAt: string;
  archived: boolean;
  url: string;
};
type Release = { repo: string; tag: string; name: string; publishedAt: string; url: string };
type NugetPackage = { id: string; version: string; downloads: number };
type DockerRepo = { name: string; pulls: number };
type Post = {
  title: string;
  url: string;
  date: string;
  summary: string;
  views: number;
  comments: number;
  diggs: number;
};

export type Snapshot = {
  generatedAt: string;
  github: {
    followers: number;
    publicRepos: number;
    totalStars: number;
    repos: Repo[];
    releases: Release[];
    history: Record<string, Release[]>;
  };
  nuget: { packageCount: number; totalDownloads: number; packages: NugetPackage[] };
  docker: { totalPulls: number; repos: DockerRepo[] };
  blog: { totalViews: number; posts: Post[] };
};

const UA = 'sdcb.ai-build (+https://sdcb.ai)';

async function getJson<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} <- ${url}`);
  return (await res.json()) as T;
}

async function getText(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} <- ${url}`);
  return (await res.text()).replace(/^\uFEFF/, '');
}

function ghHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchGithub(): Promise<Snapshot['github']> {
  const h = ghHeaders();
  const user = await getJson<{ followers: number; public_repos: number }>(`https://api.github.com/users/${GH_USER}`, h);
  const raw: any[] = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await getJson<any[]>(
      `https://api.github.com/users/${GH_USER}/repos?type=owner&per_page=100&page=${page}`,
      h,
    );
    raw.push(...batch);
    if (batch.length < 100) break;
  }
  const repos: Repo[] = raw
    .filter((r) => !r.fork && !r.private)
    .map((r) => ({
      name: r.name,
      description: r.description ?? '',
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics ?? [],
      pushedAt: r.pushed_at,
      createdAt: r.created_at,
      archived: r.archived,
      url: r.html_url,
    }))
    .sort((a, b) => b.stars - a.stars);

  const releases: Release[] = [];
  for (const repo of RELEASE_REPOS) {
    try {
      const r = await getJson<any>(`https://api.github.com/repos/${GH_USER}/${repo}/releases/latest`, h);
      releases.push({ repo, tag: r.tag_name, name: r.name || r.tag_name, publishedAt: r.published_at, url: r.html_url });
    } catch (e) {
      console.warn(`  release ${repo}: ${(e as Error).message}`);
    }
  }

  const history: Record<string, Release[]> = {};
  for (const repo of HISTORY_REPOS) {
    const list = await getJson<any[]>(`https://api.github.com/repos/${GH_USER}/${repo}/releases?per_page=40`, h);
    history[repo] = list
      .filter((r) => !r.draft)
      .map((r) => ({ repo, tag: r.tag_name, name: r.name || r.tag_name, publishedAt: r.published_at, url: r.html_url }));
  }

  return {
    followers: user.followers,
    publicRepos: user.public_repos,
    totalStars: repos.reduce((s, r) => s + r.stars, 0),
    repos,
    releases,
    history,
  };
}

async function fetchNuget(): Promise<Snapshot['nuget']> {
  const r = await getJson<{ totalHits: number; data: any[] }>(
    `https://azuresearch-usnc.nuget.org/query?q=owner:${NUGET_OWNER}&take=1000&prerelease=true&semVerLevel=2.0.0`,
  );
  const packages: NugetPackage[] = r.data
    .map((p) => ({ id: p.id, version: p.version, downloads: p.totalDownloads }))
    .sort((a, b) => b.downloads - a.downloads);
  return {
    packageCount: packages.length,
    totalDownloads: packages.reduce((s, p) => s + p.downloads, 0),
    packages,
  };
}

async function fetchDocker(): Promise<Snapshot['docker']> {
  const r = await getJson<{ results: any[] }>(`https://hub.docker.com/v2/repositories/${DOCKER_NS}/?page_size=100`);
  const repos = r.results.map((x) => ({ name: x.name, pulls: x.pull_count })).sort((a, b) => b.pulls - a.pulls);
  return { totalPulls: repos.reduce((s, x) => s + x.pulls, 0), repos };
}

const entities: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
function decode(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&(\w+);/g, (m, n) => entities[n] ?? m);
}
function clean(html: string): string {
  return decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

async function fetchBlog(): Promise<Snapshot['blog']> {
  const posts: Post[] = [];
  const seen = new Set<string>();
  for (let page = 1; page <= 40; page++) {
    const html = await getText(`https://www.cnblogs.com/${CNBLOGS}/default.html?page=${page}`);
    const blocks = html.split('<div class="postTitle"').slice(1);
    if (blocks.length === 0) break;
    for (const b of blocks) {
      const href = /class="postTitle2[^"]*"\s+href="([^"]+)"/.exec(b)?.[1];
      if (!href || seen.has(href)) continue;
      seen.add(href);
      const title = clean(/<span>([\s\S]*?)<\/span>/.exec(b)?.[1] ?? '');
      const summary = clean(
        (/class="c_b_p_desc"[^>]*>([\s\S]*?)<a [^>]*c_b_p_desc_readmore/.exec(b)?.[1] ?? '').replace(/^\s*摘要：/, ''),
      );
      const date = /posted @ (\d{4}-\d{2}-\d{2} \d{2}:\d{2})/.exec(b)?.[1] ?? '';
      const num = (label: string) => Number(new RegExp(`${label}\\((\\d+)\\)`).exec(b)?.[1] ?? 0);
      posts.push({
        title,
        url: href,
        date: date ? `${date.replace(' ', 'T')}:00+08:00` : '',
        summary,
        views: num('阅读'),
        comments: num('评论'),
        diggs: num('推荐'),
      });
    }
  }
  if (posts.length === 0) throw new Error('no posts parsed');
  posts.sort((a, b) => b.date.localeCompare(a.date));
  return { totalViews: posts.reduce((s, p) => s + p.views, 0), posts };
}

async function main() {
  let fallback: Snapshot | undefined;
  try {
    fallback = JSON.parse(await readFile(fallbackFile, 'utf8'));
  } catch {
    /* first run */
  }

  async function source<K extends keyof Omit<Snapshot, 'generatedAt'>>(key: K, fn: () => Promise<Snapshot[K]>) {
    const t = Date.now();
    try {
      const v = await fn();
      console.log(`✓ ${key} (${Date.now() - t} ms)`);
      return v;
    } catch (e) {
      if (!fallback) throw e;
      console.warn(`✗ ${key}: ${(e as Error).message} — using fallback`);
      return fallback[key];
    }
  }

  const [github, nuget, docker, blog] = await Promise.all([
    source('github', fetchGithub),
    source('nuget', fetchNuget),
    source('docker', fetchDocker),
    source('blog', fetchBlog),
  ]);
  const snapshot: Snapshot = { generatedAt: new Date().toISOString(), github, nuget, docker, blog };

  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(snapshot, null, 2));
  if (process.argv.includes('--update-fallback')) await writeFile(fallbackFile, JSON.stringify(snapshot, null, 2));
  console.log(
    `stars=${github.totalStars} repos=${github.repos.length} nuget=${nuget.totalDownloads} docker=${docker.totalPulls} posts=${blog.posts.length}`,
  );
}

await main();
