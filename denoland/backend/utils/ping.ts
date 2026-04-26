import { Request } from '@oak/oak'
import {
  IS_BEHIND_CLOUDFLARE,
  MATOMO_DOMAIN,
  MATOMO_TOKEN,
  MATOMO_WEBSITE_ID,
} from './env.ts'

export default async function ping(
  req: Request,
  remoteAddr: string
): Promise<void> {
  const requestUrl = new URL(req.url)
  const pingUrl = new URL(`https://${MATOMO_DOMAIN}/matomo.php`)
  const payload = {
    idsite: MATOMO_WEBSITE_ID,
    rec: 1,
    url: String(requestUrl),
    rand: String(Math.random()),
    apiv: 1,

    urlref: req.headers.get('Referer'),
    ua: req.headers.get('User-Agent'),
    lang: req.headers.get('Accept-Language'),
    token_auth: MATOMO_TOKEN,
    cip: IS_BEHIND_CLOUDFLARE
      ? req.headers.get('Cf-Connecting-Ip')
      : remoteAddr,
    country: IS_BEHIND_CLOUDFLARE
      ? (req.headers.get('Cf-Ipcountry') ?? '').toLowerCase()
      : '',
  }
  Object.entries(payload).forEach(([k, v]) => pingUrl.searchParams.set(k, v))
  await fetch(pingUrl, {
    method: 'POST',
  }).then((x) => x.text())
}
