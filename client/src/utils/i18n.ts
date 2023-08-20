import { createIntl, createIntlCache } from "@formatjs/intl";
import {
  LANGUAGE_FALLBACK,
  getLanguagesHelpers,
} from "@swan-io/shared-business/src/utils/languages";
import translationEN from "../locales/en.json";

// const supportedLanguages = ["en", "es", "de", "fr", "it", "nl", "pt"] as const;
const supportedLanguages = ["en"] as const;
type SupportedLanguage = (typeof supportedLanguages)[number];

export type TranslationKey = keyof typeof translationEN;
export type TranslationParams = Record<string, string | number>;

type Locale = {
  language: SupportedLanguage;
  translations: Record<string, string>;
};

const locales: Record<SupportedLanguage, () => Locale> = {
  // de: () => ({
  //   language: "de",
  //   translations: translationDE,
  // }),
  en: () => ({
    language: "en",
    translations: translationEN,
  }),
  // es: () => ({
  //   language: "es",
  //   translations: translationES,
  // }),
  // fr: () => ({
  //   language: "fr",
  //   translations: translationFR,
  // }),
  // it: () => ({
  //   language: "it",
  //   translations: translationIT,
  // }),
  // nl: () => ({
  //   language: "nl",
  //   translations: translationNL,
  // }),
  // pt: () => ({
  //   language: "pt",
  //   translations: translationPT,
  // }),
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
