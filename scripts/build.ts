import { cpSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliDecompressSync } from 'node:zlib';
rmSync('dist', { recursive: true, force: true });
cpSync('public', 'dist', { recursive: true });
for (const path of readdirSync('dist/data', { recursive: true, encoding: 'utf8' })) {
  if (!path.endsWith('.json.br')) continue;
  const source = join('dist/data', path);
  writeFileSync(source.slice(0, -3), brotliDecompressSync(readFileSync(source)));
  rmSync(source);
}
