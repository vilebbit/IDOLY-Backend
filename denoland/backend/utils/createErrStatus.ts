import { FieldStatus } from "./types.ts";

// deno-lint-ignore no-explicit-any
export default function createErrStatus(message: string, status = 400): any {
  return {
    [FieldStatus]: status,
    message,
    ok: false,
  };
}
