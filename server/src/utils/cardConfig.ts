import { S3 } from "@aws-sdk/client-s3";
import type { MultipartFile } from "@fastify/multipart";
import { Option } from "@swan-io/boxed";
import deburr from "lodash/deburr";
import snakeCase from "lodash/snakeCase";
import { chromium } from "playwright";
import { match } from "ts-pattern";
import { z } from "zod";
import { env } from "./env";
import { stringifyImage } from "./image";

const APP_URL = env.APP_URL.defined ? env.APP_URL.value : "https://card-design-studio.swan.io";

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

const isNotNullish = <T>(value: T | null | undefined): value is T => value != null;

export const parseMultiPartFormData = async (data: MultipartFile): Promise<unknown> => {
  const logo = await stringifyImage(data.file, data.mimetype);
  if (logo.isError()) {
    console.error(logo.getError());
    return null;
  }

  const entries = Object.entries(data.fields)
    .map(([key, value]) => {
      // @ts-expect-error
      const fieldValue = value.value as string;

      return match(key)
        .with("name", () => [key, fieldValue] as const)
        .with("logoScale", () => [key, parseFloat(fieldValue)] as const)
        .with("color", () => [key, fieldValue] as const)
        .with("generateScreenshot", () => [key, fieldValue === "true"] as const)
        .with("overwrite", () => [key, fieldValue === "true"] as const)
        .otherwise(() => null);
    })
    .filter(isNotNullish);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    ...Object.fromEntries(entries),
    logo: logo.value,
  };
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

/**
 * This function can be used only when the config is already saved to s3.
 * It start a browser opening the design studio and take a screenshot.
 */
const generateScreenshot = async (id: string): Promise<Buffer> => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({ width: 1600, height: 1200 });
  await page.goto(`${APP_URL}/screenshot/${id}`);

  await page.waitForLoadState("networkidle");

  // The card design studio has a cookie banner that we need to close to take a screenshot
  const button = await page.$("text=Reject All");
  if (button !== null) {
    await button.click();
  }

  await page.waitForTimeout(1000);

  const screenshot = await page.screenshot();

  await browser.close();

  return screenshot;
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

  // Save config to s3
  await s3.putObject({
    Bucket: env.S3_BUCKET_NAME,
    Key: getConfigFileKey(id),
    Body: JSON.stringify(cardConfig),
  });

  // Try to generate a screenshot
  if (cardConfig.generateScreenshot === true) {
    try {
      const screenshot = await generateScreenshot(id);
      await saveCardScreenshot(id, screenshot);
    } catch (error) {
      console.error(error);
    }
  }

  const screenshotUploaded = await isScreenshotExists(id);

  return {
    id,
    shareUrl: `${APP_URL}/share/${id}`,
    screenshotUrl: screenshotUploaded ? `${APP_URL}/api/config/${id}/screenshot` : null,
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
