import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Static entry reuses the same components, validation and analyses as the SSR app.
export default defineConfig({
  base: process.env["PAGES_BASE"] || "/portfolio/brasilia-em-ar/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist-pages",
    emptyOutDir: true,
    rolldownOptions: { input: "index.pages.html" },
  },
});
