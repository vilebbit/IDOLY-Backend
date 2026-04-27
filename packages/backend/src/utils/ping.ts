import type { Request } from 'express'
import {
  IS_BEHIND_CLOUDFLARE,
  MATOMO_DOMAIN,
  MATOMO_TOKEN,
  MATOMO_WEBSITE_ID,
} from './env'
import getOriginalUrl from './getOriginalUrl'

export default async function ping(
  req: Request,
  remoteAddr: string
): Promise<void> {
  const requestUrl = getOriginalUrl(req)
  const pingUrl = new URL(`https://${MATOMO_DOMAIN}/matomo.php`)
  const payload = {
    idsite: MATOMO_WEBSITE_ID,
    rec: 1,
    url: String(requestUrl),
    rand: String(Math.random()),
    apiv: 1,

    urlref: req.get('Referer'),
    ua: req.get('User-Agent'),
    lang: req.get('Accept-Language'),
    token_auth: MATOMO_TOKEN,
    cip: IS_BEHIND_CLOUDFLARE ? req.get('Cf-Connecting-Ip') : remoteAddr,
    country: IS_BEHIND_CLOUDFLARE
      ? (req.get('Cf-Ipcountry') ?? '').toLowerCase()
      : '',
  }
  Object.entries(payload).forEach(([k, v]) => {
    if (v) {
      pingUrl.searchParams.set(k, String(v))
    }
  })
  await fetch(pingUrl, {
    method: 'POST',
  }).then((x) => x.text())
}
