import { copyFile, mkdir, rename, writeFile } from "node:fs/promises";

await rename("dist-pages/index.pages.html", "dist-pages/index.html");

// Direct links and refreshes resolve without relying on an SSR server.
await mkdir("dist-pages/condicoes", { recursive: true });
await copyFile("dist-pages/index.html", "dist-pages/condicoes/index.html");
await copyFile("dist-pages/index.html", "dist-pages/404.html");
await writeFile("dist-pages/.nojekyll", "");
