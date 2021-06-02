import enLanguage from "../locales/en.json"

export type TranslationKey = keyof typeof enLanguage

export const t = (key: TranslationKey): string => enLanguage[key]
