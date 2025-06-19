import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  base: "/mult-moeda",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
