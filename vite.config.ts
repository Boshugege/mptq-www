import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vitePluginImp from "vite-plugin-imp";

// eslint-disable-next-line no-undef
const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "^/api/.*": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    vitePluginImp({
      libList: [
        {
          libName: "antd-mobile",
          style: () => false,
          libDirectory: "es/components",
          replaceOldImport: true,
        },
      ],
    }),
  ],

  resolve: {
    alias: {
      "~/": `${pathSrc}/`,
    },
  },
});
