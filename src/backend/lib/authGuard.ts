export const EXPECTED_ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "ossccu2026";

export function verifyAdminPin(pin: string): boolean {
  if (!pin) return false;
  return pin.trim() === EXPECTED_ADMIN_PIN;
}

export function isUserAdmin(email?: string, role?: string): boolean {
  if (!email && !role) return false;
  if (role === "admin") return true;
  if (email && (email.includes("admin") || email.endsWith("@ossccu.org"))) return true;
  return false;
}
