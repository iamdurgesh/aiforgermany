/**
 * Worker environment. Deliberately minimal, structural D1 types instead of
 * @cloudflare/workers-types to avoid conflicts with the DOM types of the
 * Angular SSR code.
 */
export interface D1PreparedStatement {
  bind(...values: readonly (string | number | null)[]): D1PreparedStatement;
  run(): Promise<{ meta: { last_row_id: number; changes: number } }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

export interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export interface Env {
  readonly DB: D1Database;
  readonly ASSETS: { fetch(request: Request): Promise<Response> };
  /** Canonical base URL for confirmation links, e.g. https://aiforgermany.de */
  readonly PUBLIC_SITE_URL: string;
  /** 'none' until the EU provider is decided (TODO-QUESTION.md #3). */
  readonly MAIL_PROVIDER: string;
}

/** Request metadata provided by Cloudflare (only what we use). */
export interface CfRequest extends Request {
  readonly cf?: { readonly country?: string };
}
