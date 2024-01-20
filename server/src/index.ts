import replyFrom from "@fastify/reply-from";
import sensible from "@fastify/sensible";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import fs from "fs";
import path from "pathe";
import { createViteDevServer } from "./client/devServer";
import {
  getCardConfig,
  saveCardConfig,
  createConfigSchema,
  getScreenshot,
} from "./utils/cardConfig";
import { clientEnv, env } from "./utils/env";

const PORT = 8080;

const start = async () => {
  const app = fastify();

  await app.register(sensible);
  await app.register(replyFrom);

  app.get("/health", async (request, reply) => {
    return reply.header("cache-control", `public, max-age=0`).status(200).send({
      date: new Date().toISOString(),
    });
  });

  app.post("/api/config", async (request, reply) => {
    const parsedBody = createConfigSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return reply.badRequest();
    }

    const body = parsedBody.data;

    const configInfo = await saveCardConfig(body);

    return reply.status(201).send(configInfo);
  });

  app.get("/api/config/:id", async (request, reply) => {
    // @ts-expect-error
    const configId: string = request.params.id; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

    const cardConfig = await getCardConfig(configId);

    return cardConfig.match({
      None: () => reply.notFound(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      Some: config => reply.status(200).send(config),
    });
  });

  app.get("/api/config/:id/screenshot", async (request, reply) => {
    // @ts-expect-error
    const configId: string = request.params.id; // eslint-disable-line @typescript-eslint/no-unsafe-assignment

    const screenshot = await getScreenshot(configId);

    return screenshot.match({
      None: () => reply.notFound(),
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      Some: stream => {
        return reply.type("image/png").header("cache-control", `public, max-age=0`).send(stream);
      },
    });
  });

  app.get("/env.js", async (request, reply) => {
    return reply
      .type("application/javascript")
      .header("cache-control", `public, max-age=0`)
      .send(`window.__env = ${JSON.stringify(clientEnv, null, 2)};`);
  });

  if (env.NODE_ENV !== "production") {
    const { mainServerPort } = await createViteDevServer();
    const base = `http://localhost:${mainServerPort}`;

    app.get("/*", async (request, reply) => {
      return reply.from(`${base}${request.url}`);
    });
  } else {
    const assetsPath = path.join(__dirname, "./assets");
    const indexHtmlPath = path.join(assetsPath, "./index.html");

    await app.register(fastifyStatic, {
      root: assetsPath,
    });

    app.setNotFoundHandler(async (request, reply) => {
      const stream = fs.createReadStream(indexHtmlPath);
      return reply.type("text/html").send(stream);
    });
  }

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`server listening on ${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

void start();
