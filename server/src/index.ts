import replyFrom from "@fastify/reply-from";
import sensible from "@fastify/sensible";
import fastifyStatic from "@fastify/static";
import fastify from "fastify";
import path from "pathe";
import { createViteDevServer } from "./client/devServer";

const PORT = 8080;
const NODE_ENV = process.env.NODE_ENV ?? "development";

const start = async () => {
  const app = fastify();

  await app.register(sensible);
  await app.register(replyFrom);

  app.get("/health", async (request, reply) => {
    return reply.header("cache-control", `public, max-age=0`).status(200).send({
      date: new Date().toISOString(),
    });
  });

  app.post("/api/save-config", async (request, reply) => {
    console.log(request.body);
    return reply.send({ hello: "world" });
  });

  if (NODE_ENV !== "production") {
    const { mainServerPort } = await createViteDevServer();
    const base = `http://localhost:${mainServerPort}`;

    app.get("/*", async (request, reply) => {
      return reply.from(`${base}${request.url}`);
    });
  } else {
    await app.register(fastifyStatic, {
      root: path.join(__dirname, "./assets"),
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
