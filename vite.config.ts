import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  root: "./src",
  base: "/card-design-studio/",
  plugins: [reactRefresh()],
})
