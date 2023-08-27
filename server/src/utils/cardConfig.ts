import { Option } from "@swan-io/boxed";
import deburr from "lodash/deburr";
import snakeCase from "lodash/snakeCase";
import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

export const cardConfigSchema = z.object({
  name: z.string(),
  logo: z.string(),
  logoScale: z.number().min(0).max(1),
  color: z.union([z.literal("Silver"), z.literal("Black")]),
});

export type CardConfig = z.infer<typeof cardConfigSchema>;

const uploadFolderPath = path.resolve(__dirname, "../../uploads");

const isConfigExists = async (id: string): Promise<boolean> => {
  // First implementation with file system, will be replaced by S3 bucket
  const filePath = path.resolve(__dirname, uploadFolderPath, `${id}.json`);
  return fs
    .stat(filePath)
    .then(() => true)
    .catch(() => false);
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

  // First implementation with file system, will be replaced by S3 bucket
  const folderExists = await fs
    .stat(uploadFolderPath)
    .then(() => true)
    .catch(() => false);
  if (!folderExists) {
    await fs.mkdir(uploadFolderPath);
  }

  const filePath = path.resolve(uploadFolderPath, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(cardConfig), { encoding: "utf-8" });

  return id;
};

export const getCardConfig = async (id: string): Promise<Option<CardConfig>> => {
  try {
    // First implementation with file system, will be replaced by S3 bucket
    const filePath = path.resolve(__dirname, uploadFolderPath, `${id}.json`);
    const configFile = await fs.readFile(filePath, { encoding: "utf-8" });
    const config = cardConfigSchema.parse(JSON.parse(configFile));

    return Option.Some(config);
  } catch {
    return Option.None();
  }
};
