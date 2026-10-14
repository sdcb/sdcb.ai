// Publishes a .NET browser-wasm project and copies its _framework into public/<name>/.
import { execFileSync } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const targets = { ocr: 'ocr-wasm', gcdr: 'gcdr-wasm' } as const;
const which = process.argv[2] as keyof typeof targets;
if (!(which in targets)) {
  console.error(`usage: node scripts/build-wasm.ts <${Object.keys(targets).join('|')}>`);
  process.exit(1);
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const project = resolve(root, targets[which]);
const publishDir = resolve(project, 'bin/publish');
const target = resolve(root, `public/${which}/_framework`);

await rm(publishDir, { recursive: true, force: true });
// DOTNET_EXE lets a machine point at a user-local SDK that has the wasm-tools workload.
execFileSync(process.env.DOTNET_EXE || 'dotnet', ['publish', '-c', 'Release', '-o', publishDir, '-nologo'], { cwd: project, stdio: 'inherit' });
await rm(target, { recursive: true, force: true });
await cp(resolve(publishDir, 'wwwroot/_framework'), target, { recursive: true });
console.log(`✓ copied _framework → ${target}`);
