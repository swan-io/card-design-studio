import { S3 } from "@aws-sdk/client-s3";
import { Option } from "@swan-io/boxed";
import deburr from "lodash/deburr";
import snakeCase from "lodash/snakeCase";
import { z } from "zod";
import { env } from "./env";

const credentials =
  env.AWS_ACCESS_KEY_ID.defined === true && env.AWS_SECRET_ACCESS_KEY.defined === true
    ? {
        accessKeyId: env.AWS_ACCESS_KEY_ID.value,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY.value,
      }
    : undefined;

const s3 = new S3({
  credentials,
  region: env.AWS_REGION,
});

const getConfigKey = (id: string): string => `card-configs/${id}`;
const getConfigFileKey = (id: string): string => `${getConfigKey(id)}/config.json`;

export const cardConfigSchema = z.object({
  name: z.string().min(1),
  logo: z.string(),
  logoScale: z.number().min(0).max(1),
  color: z.union([z.literal("Silver"), z.literal("Black"), z.literal("Custom")]),
});

export type CardConfig = z.infer<typeof cardConfigSchema>;

const isConfigExists = async (id: string): Promise<boolean> => {
  const data = await s3.listObjectsV2({
    Bucket: env.S3_BUCKET_NAME,
    Prefix: getConfigKey(id),
  });
  const contents = data.Contents ?? [];

  return contents.length > 0;
};

const generateConfigId = async (name: string): Promise<string> => {
  const id = snakeCase(deburr(name));

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

export const saveCardConfig = async (cardConfig: CardConfig): Promise<string> => {
  const id = await generateConfigId(cardConfig.name);

  await s3.putObject({
    Bucket: env.S3_BUCKET_NAME,
    Key: getConfigFileKey(id),
    Body: JSON.stringify(cardConfig),
  });

  return id;
};

export const getCardConfig = async (id: string): Promise<Option<CardConfig>> => {
  try {
    const object = await s3.getObject({
      Bucket: env.S3_BUCKET_NAME,
      Key: getConfigFileKey(id),
    });

    const configFile = (await object.Body?.transformToString()) ?? "{}";
    const config = cardConfigSchema.parse(JSON.parse(configFile));

    return Option.Some(config);
  } catch {
    return Option.None();
  }
};
