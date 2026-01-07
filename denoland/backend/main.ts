import { Application, Router } from '@oak/oak'
import * as Sentry from 'sentry'
import manifest from './routes.ts'
import checkEnv from '@utils/checkEnv.ts'
import env, { isDevelopEnv, SENTRY_DSN } from './utils/env.ts'

checkEnv()
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: isDevelopEnv ? 1.0 : 0.2,
})
Sentry.setTag('machine', env.BACKEND_INSTANCE_ID)

const app = new Application()
const router = new Router()

Object.entries(manifest.routes).map(([name, routes]) =>
  router.all(name, routes)
)

app.use(router.routes())
app.use(router.allowedMethods())

app.addEventListener('listen', ({ port }) =>
  console.log(`App is listening on port http://localhost:${port}`)
)

await app.listen({ port: 8000 })
