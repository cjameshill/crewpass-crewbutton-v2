import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  ssr: false,
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/crewpass-crewbutton-v2.js`,
        chunkFileNames: `assets/crewpass-crewbutton-v2.js`,
        assetFileNames: `assets/crewpass-crewbutton-v2.[ext]`
      }
    }
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  // esbuild: {
  //   drop: ["console"]
  // }
});