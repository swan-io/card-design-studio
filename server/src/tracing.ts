/* eslint-disable */

import FastifyOtelInstrumentation from "@fastify/otel";
import { metrics } from "@opentelemetry/api";
import { PrometheusExporter } from "@opentelemetry/exporter-prometheus";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { NodeSDK } from "@opentelemetry/sdk-node";
import fs from "node:fs";
import path from "pathe";

const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"),
) as { version: string };

const serviceName = process.env.OTEL_SERVICE_NAME;
const metricsPort = Number(process.env.OTEL_EXPORTER_PROMETHEUS_PORT ?? 9464);

/**
 * Must be run after `sdk.start()` — that's what registers the global meter provider.
 * Before it, `getMeter()` returns a no-op meter and nothing is exported.
 */
const registerMetrics = () => {
  metrics
    .getMeter("card-design-studio")
    .createGauge("swan_app_build_info", { description: "Build information" })
    .record(1, { version: packageJson.version });
};

if (serviceName != null) {
  const sdk = new NodeSDK({
    serviceName,
    instrumentations: [
      // Records the `http.server.request.duration` histogram (request rate, latency,
      // status codes) — this is what actually feeds the Prometheus endpoint.
      new HttpInstrumentation(),
      // Doesn't emit metrics of its own, but resolves the matched Fastify route so the
      // histogram above is labelled with `http_route="/api/config/:id"` rather than
      // one time series per config id.
      new FastifyOtelInstrumentation({ registerOnInitialization: true }),
    ],
    metricReaders: [
      new PrometheusExporter({ port: metricsPort }, () => {
        console.log(`Prometheus metrics exposed on port ${metricsPort} (/metrics)`);
      }),
    ],
  });

  sdk.start();
  registerMetrics();
}
