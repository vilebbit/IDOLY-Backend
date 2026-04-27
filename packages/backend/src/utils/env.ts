export const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION ?? ''
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE ?? ''
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? ''
export const READONLY_TOKEN = process.env.READONLY_TOKEN ?? ''
export const MATOMO_DOMAIN = process.env.MATOMO_DOMAIN ?? ''
export const MATOMO_WEBSITE_ID = process.env.MATOMO_WEBSITE_ID ?? ''
export const MATOMO_TOKEN = process.env.MATOMO_TOKEN ?? ''
export const GHTOKEN_ADV = process.env.GHTOKEN_ADV ?? ''
export const GHREPO_ADV = process.env.GHREPO_ADV ?? ''
export const SENTRY_DSN = process.env.SENTRY_DSN ?? ''
export const BACKEND_INSTANCE_ID = process.env.BACKEND_INSTANCE_ID ?? 'unknown'
export const IS_BEHIND_CLOUDFLARE =
  String(process.env.IS_BEHIND_CLOUDFLARE ?? 'false').toLowerCase() === 'true'

/**
 * Setting env `NODE_ENV=development` will bypass all authentications.
 */
export const isDevelopEnv = process.env.NODE_ENV === 'development'

const env = {
  MONGODB_CONNECTION,
  MONGODB_DATABASE,

  ADMIN_TOKEN,
  READONLY_TOKEN,

  MATOMO_DOMAIN,
  MATOMO_WEBSITE_ID,
  MATOMO_TOKEN,
  GHTOKEN_ADV,
  GHREPO_ADV,
  SENTRY_DSN,
  BACKEND_INSTANCE_ID,
  IS_BEHIND_CLOUDFLARE,
}

export default env
