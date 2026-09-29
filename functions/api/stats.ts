// Live counters for the numbers baked into the static pages. Cached at the edge for an hour;
// any upstream that fails is simply omitted so the client keeps its build-time snapshot value.

interface Env {
  GITHUB_TOKEN?: string;
}

const TTL = 3600;
const UA = 'sdcb.ai-edge (+https://sdcb.ai)';

async function json<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...headers } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json() as Promise<T>;
}

async function github(token?: string) {
  const h: Record<string, string> = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  if (token) h.Authorization = `Bearer ${token}`;
  const [user, ...pages] = await Promise.all([
    json<{ followers: number }>('https://api.github.com/users/sdcb', h),
    json<any[]>('https://api.github.com/users/sdcb/repos?type=owner&per_page=100&page=1', h),
    json<any[]>('https://api.github.com/users/sdcb/repos?type=owner&per_page=100&page=2', h),
  ]);
  const repos = pages.flat().filter((r) => !r.fork);
  return {
    followers: user.followers,
    stars: repos.reduce((s, r) => s + r.stargazers_count, 0),
    repos: Object.fromEntries(repos.map((r) => [String(r.name).toLowerCase(), r.stargazers_count as number])),
  };
}

async function nuget() {
  const r = await json<{ data: { totalDownloads: number }[] }>(
    'https://azuresearch-usnc.nuget.org/query?q=owner:sdflysha&take=1000&prerelease=true&semVerLevel=2.0.0',
  );
  return { nugetDownloads: r.data.reduce((s, p) => s + p.totalDownloads, 0), nugetPackages: r.data.length };
}

async function docker() {
  const r = await json<{ results: { pull_count: number }[] }>('https://hub.docker.com/v2/repositories/sdcb/?page_size=100');
  return { dockerPulls: r.results.reduce((s, x) => s + x.pull_count, 0) };
}

async function build(env: Env) {
  const [gh, ng, dk] = await Promise.allSettled([github(env.GITHUB_TOKEN), nuget(), docker()]);
  const totals: Record<string, number> = {};
  let repos: Record<string, number> = {};
  if (gh.status === 'fulfilled') {
    totals.stars = gh.value.stars;
    totals.followers = gh.value.followers;
    repos = gh.value.repos;
  }
  if (ng.status === 'fulfilled') Object.assign(totals, ng.value);
  if (dk.status === 'fulfilled') Object.assign(totals, dk.value);
  return { generatedAt: new Date().toISOString(), totals, repos };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const cache = caches.default;
  const key = new Request(new URL('/api/stats', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  const body = await build(env);
  const res = new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=300, s-maxage=${TTL}`,
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (Object.keys(body.totals).length) waitUntil(cache.put(key, res.clone()));
  return res;
};
