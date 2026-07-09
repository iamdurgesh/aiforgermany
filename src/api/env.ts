/**
 * Worker-Umgebung. Bewusst minimale, strukturelle D1-Typen statt
 * @cloudflare/workers-types, um Konflikte mit den DOM-Typen des
 * Angular-SSR-Codes zu vermeiden.
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
  /** Kanonische Basis-URL für Bestätigungslinks, z. B. https://aiforgermany.de */
  readonly PUBLIC_SITE_URL: string;
  /** 'none' bis der EU-Provider entschieden ist (TODO-QUESTION.md #3). */
  readonly MAIL_PROVIDER: string;
}

/** Von Cloudflare am Request bereitgestellte Metadaten (nur das Genutzte). */
export interface CfRequest extends Request {
  readonly cf?: { readonly country?: string };
}
