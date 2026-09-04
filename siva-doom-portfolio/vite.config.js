import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import contactHandler from "./api/contact.js";

// Vite plugin to simulate serverless /api/contact endpoint during local development
function apiDevPlugin() {
  return {
    name: "api-dev-server",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split("?")[0] : "";
        if (url === "/api/contact" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });
          req.on("end", async () => {
            try {
              req.body = body ? JSON.parse(body) : {};
            } catch {
              req.body = {};
            }
            await contactHandler(req, res);
          });
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables so process.env has RESEND_API_KEY, etc. in dev
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), apiDevPlugin()],
    server: { port: 5173, host: true },
    build: { sourcemap: false }
  };
});