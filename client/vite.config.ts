import legacy from "@vitejs/plugin-legacy";
import react from "@vitejs/plugin-react-swc";
import path from "pathe";
import { defineConfig, searchForWorkspaceRoot } from "vite";

const root = path.resolve(__dirname, "./src");

const getLakePaths = () => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { lake } = require("../locale.config");
    return typeof lake === "string" ? [lake] : [];
  } catch {
    return []; // locale-config.js doesn't exist
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  root,
  build: {
    emptyOutDir: true,
    outDir: "../dist",
  },
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // get assets from lake repository
        ...getLakePaths(),
      ],
    },
  },
  plugins: [
    legacy({
      targets: ["defaults", "not IE 11"],
      polyfills: ["es.object.from-entries"],
    }),
    react(),
  ],
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
  },
  publicDir: "./public",
});
