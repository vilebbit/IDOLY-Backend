export const MONGODB_API_APPID = Deno.env.get('MONGODB_API_APPID') ?? ''
export const MONGODB_DATABASE = Deno.env.get('MONGODB_DATABASE') ?? ''
export const MONGODB_API_KEY = Deno.env.get('MONGODB_API_KEY') ?? ''
export const MONGODB_DATA_SOURCE = Deno.env.get('MONGODB_DATA_SOURCE') ?? ''
export const ADMIN_TOKEN = Deno.env.get('ADMIN_TOKEN') ?? ''
export const READONLY_TOKEN = Deno.env.get('READONLY_TOKEN') ?? ''
export const MATOMO_DOMAIN = Deno.env.get('MATOMO_DOMAIN') ?? ''
export const MATOMO_WEBSITE_ID = Deno.env.get('MATOMO_WEBSITE_ID') ?? ''
export const MATOMO_TOKEN = Deno.env.get('MATOMO_TOKEN') ?? ''
export const GHTOKEN_ADV = Deno.env.get('GHTOKEN_ADV') ?? ''
export const GHREPO_ADV = Deno.env.get('GHREPO_ADV') ?? ''
export const MONGODB_CONNECTION = Deno.env.get('MONGODB_CONNECTION') ?? ''
export const SENTRY_DSN = Deno.env.get('SENTRY_DSN') ?? ''
export const BACKEND_INSTANCE_ID =
  Deno.env.get('BACKEND_INSTANCE_ID') ?? 'unknown'
export const IS_BEHIND_CLOUDFLARE =
  String(Deno.env.get('IS_BEHIND_CLOUDFLARE') ?? 'false').toLowerCase() ===
  'true'

/**
 * Setting env `DENO_ENV=development` will bypass all authentications.
 */
export const isDevelopEnv = Deno.env.get('DENO_ENV') === 'development'

const env = {
  MONGODB_API_APPID,
  MONGODB_DATABASE,
  MONGODB_API_KEY,
  MONGODB_DATA_SOURCE,
  ADMIN_TOKEN,
  READONLY_TOKEN,

  MATOMO_DOMAIN,
  MATOMO_WEBSITE_ID,
  MATOMO_TOKEN,
  GHTOKEN_ADV,
  GHREPO_ADV,
  MONGODB_CONNECTION,
  SENTRY_DSN,
  BACKEND_INSTANCE_ID,
  IS_BEHIND_CLOUDFLARE,
}

export default env
