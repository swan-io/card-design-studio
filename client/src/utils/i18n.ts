import { createIntl, createIntlCache } from "@formatjs/intl";
import {
  LANGUAGE_FALLBACK,
  getLanguagesHelpers,
} from "@swan-io/shared-business/src/utils/languages";
import translationEN from "../locales/en.json";

const supportedLanguages = ["en"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

export type TranslationKey = keyof typeof translationEN;
export type TranslationParams = Record<string, string | number>;

type Locale = {
  language: SupportedLanguage;
  translations: Record<string, string>;
};

const locales: Record<SupportedLanguage, () => Locale> = {
  en: () => ({
    language: "en",
    translations: translationEN,
  }),
};

export const { getBestLocale, getFirstSupportedLanguage, setPreferredLanguage } =
  getLanguagesHelpers(supportedLanguages);

export const locale = getBestLocale(locales);

const intl = createIntl(
  {
    defaultLocale: LANGUAGE_FALLBACK,
    fallbackOnEmptyString: false,
    locale: locale.language,
    messages: locale.translations,
  },
  createIntlCache(),
);

export const t = (key: TranslationKey, params?: TranslationParams) =>
  intl.formatMessage({ id: key, defaultMessage: translationEN[key] }, params).toString();
