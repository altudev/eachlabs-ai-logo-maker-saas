// Supported locales
export type SupportedLocale = "en" | "tr" | "es"

export const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "tr", "es"]
export const DEFAULT_LOCALE: SupportedLocale = "en"

// Translation domains
export type TranslationDomain = "errors" | "credits" | "rate-limit" | "validation"

// Type-safe translation keys
export interface TranslationKeys {
  errors: {
    authRequired: string
    unauthorized: string
    forbidden: string
    adminRequired: string
    notFound: string
    predictionNotFound: string
    generationNotFound: string
    userNotFound: string
    internalError: string
    providerUnreachable: string
    providerInvalidResponse: string
    invalidRequestBody: string
    invalidPredictionId: string
    invalidGenerationId: string
    invalidUserId: string
    invalidQueryParams: string
    invalidModel: string
    configMissing: string
    invalidSignature: string
    webhookFailed: string
    missingOrderId: string
    creditsUndetermined: string
    fetchGenerationsFailed: string
  }
  credits: {
    insufficientCredits: string
    insufficientCreditsDetail: string
    fetchBalanceFailed: string
    fetchTransactionsFailed: string
    fetchPackagesFailed: string
    adjustFailed: string
    addFailed: string
    welcomeBonus: string
    welcomeBonusPlural: string
    logoGeneration: string
    logoGenerationDefault: string
    refundProviderUnreachable: string
    refundProviderInvalid: string
    refundProviderError: string
    refundInternalError: string
    creditsAdded: string
    adminAdjustment: string
    purchaseDescription: string
    testCreditAddition: string
    userIdAndCreditsRequired: string
    fetchUserBalanceFailed: string
    fetchUserTransactionsFailed: string
  }
  "rate-limit": {
    strict: string
    moderate: string
    relaxed: string
  }
  validation: {
    invalidRequest: string
    invalidParams: string
  }
}

// Flattened key type for dot notation access
export type TranslationKey =
  | `errors.${keyof TranslationKeys["errors"]}`
  | `credits.${keyof TranslationKeys["credits"]}`
  | `rate-limit.${keyof TranslationKeys["rate-limit"]}`
  | `validation.${keyof TranslationKeys["validation"]}`

// Interpolation params type
export type InterpolationParams = Record<string, string | number>
