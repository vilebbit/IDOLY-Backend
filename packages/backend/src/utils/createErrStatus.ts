import { FieldStatus } from './types'

export default function createErrStatus(message: string, status = 400): any {
  return {
    [FieldStatus]: status,
    message,
    ok: false,
  }
}
