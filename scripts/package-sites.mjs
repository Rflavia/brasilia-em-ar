import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

// Preserve the existing TanStack/Nitro Cloudflare build; adapt its artifact layout.
await rm('dist', { recursive: true, force: true });
await mkdir('dist/server', { recursive: true });
await cp('.output/server', 'dist/server/app', { recursive: true });
await mkdir('dist/.openai', { recursive: true });
await cp('.openai/hosting.json', 'dist/.openai/hosting.json');
const mime = { '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8', '.png':'image/png', '.json':'application/json; charset=utf-8', '.woff2':'font/woff2', '.ico':'image/x-icon' };
const assets = {};
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) { await walk(path); continue; }
    if (entry.name.startsWith('_')) continue;
    const url = '/' + relative('.output/public', path).replaceAll('\\', '/');
    const extension = '.' + entry.name.split('.').at(-1);
    assets[url] = { body:(await readFile(path)).toString('base64'), type:mime[extension] ?? 'application/octet-stream' };
  }
}
await walk('.output/public');
await writeFile('dist/server/assets.js', 'export default '+JSON.stringify(assets)+';\n');
await writeFile('dist/server/index.js', `import app from './app/index.mjs';
import assets from './assets.js';
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const asset = assets[url.pathname];
    if (asset && (request.method === 'GET' || request.method === 'HEAD')) {
      const headers = { 'Content-Type':asset.type, 'Cache-Control':url.pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=3600' };
      const bytes = request.method === 'HEAD' ? null : Uint8Array.from(atob(asset.body), c => c.charCodeAt(0));
      return new Response(bytes, {headers});
    }
    return app.fetch(request, env, ctx);
  }
};\n`);
console.log('Sites artifact ready: TanStack server + '+Object.keys(assets).length+' static assets.');
