import http from "node:http";
import path from "pathe";

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

export async function createViteDevServer() {
  const liveReloadServer = http.createServer();
  // @ts-expect-error: Vite is installed at root level, we import it dynamically only when running the dev server
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
