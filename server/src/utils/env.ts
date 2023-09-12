import { oneOf, string, validate } from "valienv";

process.env.NODE_ENV = process.env.NODE_ENV ?? "development";

export const env = validate({
  env: process.env,
  validators: {
    NODE_ENV: oneOf("development", "production"),
    CLIENT_GOOGLE_TAG_MANAGER_ID: string,
  },
});

export const clientEnv = Object.fromEntries(
  Object.entries(env).filter(([key]) => key.startsWith("CLIENT_")),
);
