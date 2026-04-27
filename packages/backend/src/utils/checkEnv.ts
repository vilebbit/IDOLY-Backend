import env from './env'

export default function checkEnv() {
  console.info('Checking environment variables...')
  for (const [key, val] of Object.entries(env)) {
    if (val === '') {
      throw Error(`Environment variable "${key} not found!"`)
    }
  }
}
