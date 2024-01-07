import { oneOf, optional, string, validate } from "valienv";

process.env.NODE_ENV = process.env.NODE_ENV ?? "development";

export const env = validate({
  env: process.env,
  validators: {
    NODE_ENV: oneOf("development", "production"),
    CLIENT_GOOGLE_TAG_MANAGER_ID: string,
    AWS_ACCESS_KEY_ID: optional(string),
    AWS_SECRET_ACCESS_KEY: optional(string),
    AWS_REGION: string,
    S3_BUCKET_NAME: string,
    S3_ENDPOINT: optional(string),
  },
});

export const clientEnv = Object.fromEntries(
  Object.entries(env).filter(([key]) => key.startsWith("CLIENT_")),
);
