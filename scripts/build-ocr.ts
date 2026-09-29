// Publishes ocr-wasm (.NET browser-wasm) and copies its _framework into public/ocr/.
import { execFileSync } from 'node:child_process';
import { cp, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const project = resolve(root, 'ocr-wasm');
const publishDir = resolve(project, 'bin/publish');
const target = resolve(root, 'public/ocr/_framework');

await rm(publishDir, { recursive: true, force: true });
// DOTNET_EXE lets a machine point at a user-local SDK that has the wasm-tools workload.
execFileSync(process.env.DOTNET_EXE || 'dotnet', ['publish', '-c', 'Release', '-o', publishDir, '-nologo'], { cwd: project, stdio: 'inherit' });
await rm(target, { recursive: true, force: true });
await cp(resolve(publishDir, 'wwwroot/_framework'), target, { recursive: true });
console.log(`✓ copied _framework → ${target}`);
