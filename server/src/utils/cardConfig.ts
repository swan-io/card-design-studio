import { Option } from "@swan-io/boxed";
import deburr from "lodash/deburr";
import snakeCase from "lodash/snakeCase";
import { z } from "zod";

export const cardConfigSchema = z.object({
  name: z.string(),
  logo: z.string(),
  logoScale: z.number(),
  color: z.union([z.literal("Silver"), z.literal("Black")]),
});

export type CardConfig = z.infer<typeof cardConfigSchema>;

const isConfigExists = async (_id: string): Promise<boolean> => {
  // TODO check if config exists in database
  await new Promise(resolve => setTimeout(resolve, 100));
  return false;
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

  // TODO: save config to database

  return id;
};

export const getCardConfig = async (_id: string): Promise<Option<CardConfig>> => {
  // TODO: get config from database
  await new Promise(resolve => setTimeout(resolve, 100));
  return Option.None();
};
