import { S3 } from "@aws-sdk/client-s3";
import { Option } from "@swan-io/boxed";
import deburr from "lodash/deburr";
import snakeCase from "lodash/snakeCase";
import { z } from "zod";
import { env } from "./env";

const APP_URL = "https://card-design-studio.swan.io";

const credentials =
  env.AWS_ACCESS_KEY_ID.defined === true && env.AWS_SECRET_ACCESS_KEY.defined === true
    ? {
        accessKeyId: env.AWS_ACCESS_KEY_ID.value,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY.value,
      }
    : undefined;

const s3 = new S3({
  endpoint: env.S3_ENDPOINT.defined === true ? env.S3_ENDPOINT.value : undefined,
  forcePathStyle: env.S3_ENDPOINT.defined === true,
  credentials,
  region: env.AWS_REGION,
});

const getConfigKey = (id: string): string => `card-configs/${id}`;
const getConfigFileKey = (id: string): string => `${getConfigKey(id)}/config.json`;
const getScreenshotFileKey = (id: string): string => `${getConfigKey(id)}/screenshot.png`;

export const createConfigSchema = z.object({
  name: z.string().min(1),
  logo: z.string(),
  logoScale: z.number().min(0).max(1),
  color: z.union([z.literal("Silver"), z.literal("Black"), z.literal("Custom")]),
  generateScreenshot: z.boolean().optional(),
  overwrite: z.boolean().optional(),
});

export type CreateConfig = z.infer<typeof createConfigSchema>;

export const cardConfigSchema = z.object({
  name: z.string().min(1),
  logo: z.string(),
  logoScale: z.number().min(0).max(1),
  color: z.union([z.literal("Silver"), z.literal("Black"), z.literal("Custom")]),
});

export type CardConfig = z.infer<typeof cardConfigSchema>;

export type CardConfigInfo = CardConfig & {
  shareUrl: string;
  screenshotUrl: string | null;
};

export type CreateConfigResponse = {
  id: string;
  screenshotUrl: string | null;
  shareUrl: string;
};

const isScreenshotExists = async (id: string): Promise<boolean> => {
  const data = await s3.listObjectsV2({
    Bucket: env.S3_BUCKET_NAME,
    Prefix: getScreenshotFileKey(id),
  });
  const contents = data.Contents ?? [];

  return contents.length > 0;
};

const saveCardScreenshot = async (id: string, screenshot: Buffer): Promise<void> => {
  await s3.putObject({
    Bucket: env.S3_BUCKET_NAME,
    Key: getScreenshotFileKey(id),
    Body: screenshot,
  });
};

const generateScreenshot = async (_id: string): Promise<Buffer> => {
  return Promise.resolve(Buffer.from("TODO"));
};

const isConfigExists = async (id: string): Promise<boolean> => {
  const data = await s3.listObjectsV2({
    Bucket: env.S3_BUCKET_NAME,
    Prefix: getConfigKey(id),
  });
  const contents = data.Contents ?? [];

  return contents.length > 0;
};

const generateConfigId = async (name: string, canOverwrite: boolean): Promise<string> => {
  const id = snakeCase(deburr(name));

  if (canOverwrite) {
    return id;
  }

  const getUniqueConfigId = async (id: string, index = 0): Promise<string> => {
    const configId = index === 0 ? id : `${id}_${index}`;

    const exists = await isConfigExists(configId);
    if (exists) {
      return getUniqueConfigId(id, index + 1);
    }

    return configId;
  };

  return getUniqueConfigId(id);
};

export const saveCardConfig = async (cardConfig: CreateConfig): Promise<CreateConfigResponse> => {
  const id = await generateConfigId(cardConfig.name, cardConfig.overwrite === true);

  if (cardConfig.generateScreenshot === true) {
    const screenshot = await generateScreenshot(id);
    await saveCardScreenshot(id, screenshot);
  }

  await s3.putObject({
    Bucket: env.S3_BUCKET_NAME,
    Key: getConfigFileKey(id),
    Body: JSON.stringify(cardConfig),
  });

  return {
    id,
    shareUrl: `${APP_URL}/share/${id}`,
    screenshotUrl:
      cardConfig.generateScreenshot === true ? `${APP_URL}/api/config/${id}/screenshot` : null,
  };
};

export const getCardConfig = async (id: string): Promise<Option<CardConfigInfo>> => {
  try {
    const [object, screenshotExists] = await Promise.all([
      s3.getObject({
        Bucket: env.S3_BUCKET_NAME,
        Key: getConfigFileKey(id),
      }),
      isScreenshotExists(id),
    ]);

    const configFile = (await object.Body?.transformToString()) ?? "{}";
    const config = cardConfigSchema.parse(JSON.parse(configFile));

    return Option.Some({
      ...config,
      shareUrl: `${APP_URL}/share/${id}`,
      screenshotUrl: screenshotExists ? `${APP_URL}/api/config/${id}/screenshot` : null,
    });
  } catch {
    return Option.None();
  }
};

export const getScreenshot = async (id: string): Promise<Option<ReadableStream>> => {
  try {
    const object = await s3.getObject({
      Bucket: env.S3_BUCKET_NAME,
      Key: getScreenshotFileKey(id),
    });

    if (object.Body === undefined) {
      return Option.None();
    }

    return Option.Some(object.Body as ReadableStream);
  } catch {
    return Option.None();
  }
};
