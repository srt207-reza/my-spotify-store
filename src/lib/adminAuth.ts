import "server-only";

export const ADMIN_SECRET = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3Q3";

export function hasValidAdminSecret(request: Request): boolean {
    return request.headers.get("x-admin-secret") === ADMIN_SECRET;
}
