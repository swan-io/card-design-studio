import http from "node:http";
import path from "pathe";

export async function createViteDevServer() {
  const liveReloadServer = http.createServer();
  const { createServer } = await import("vite");
  const { default: getPort } = await import("get-port");
  const mainServerPort = await getPort();
  const liveReloadServerPort = await getPort();
  liveReloadServer.listen(liveReloadServerPort);

  const server = await createServer({
    configFile: path.resolve(process.cwd(), "client", "vite.config.ts"),
    server: {
      port: mainServerPort,
      hmr: {
        server: liveReloadServer,
        port: liveReloadServerPort,
      },
    },
  });

  await server.listen();

  return { mainServerPort, liveReloadServerPort };
}
