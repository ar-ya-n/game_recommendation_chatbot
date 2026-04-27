import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/auth": "http://localhost:5001",
      "/chat": "http://localhost:5001",
      "/user": "http://localhost:5001",
      "/health": "http://localhost:5001",
    },
  },
});
