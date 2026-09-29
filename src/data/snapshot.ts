import type { Snapshot } from '../../scripts/fetch-data.ts';
import fallback from './fallback.json';

const generated = import.meta.glob<{ default: Snapshot }>('./generated/snapshot.json', { eager: true });

export const snapshot: Snapshot = Object.values(generated)[0]?.default ?? (fallback as Snapshot);

export type { Snapshot };

export function repo(name: string) {
  return snapshot.github.repos.find((r) => r.name.toLowerCase() === name.toLowerCase());
}

export function release(name: string) {
  return snapshot.github.releases.find((r) => r.repo.toLowerCase() === name.toLowerCase());
}

export function nugetDownloads(prefixes: string[]): number {
  const lower = prefixes.map((p) => p.toLowerCase());
  return snapshot.nuget.packages
    .filter((p) => lower.some((pre) => p.id.toLowerCase() === pre || p.id.toLowerCase().startsWith(pre + '.')))
    .reduce((s, p) => s + p.downloads, 0);
}

export function dockerPulls(names: string[]): number {
  return snapshot.docker.repos.filter((r) => names.includes(r.name)).reduce((s, r) => s + r.pulls, 0);
}

export const totals = {
  stars: snapshot.github.totalStars,
  followers: snapshot.github.followers,
  repos: snapshot.github.repos.length,
  nugetDownloads: snapshot.nuget.totalDownloads,
  nugetPackages: snapshot.nuget.packageCount,
  dockerPulls: snapshot.docker.totalPulls,
  posts: snapshot.blog.posts.length,
  blogViews: snapshot.blog.totalViews,
};
