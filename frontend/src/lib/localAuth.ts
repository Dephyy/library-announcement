export type AuthContext = {
  username: string;
  role: string;
};

export function parseAuthCookie(value: string | undefined): AuthContext | null {
  if (!value) return null;
  const parts = value.split(":");
  if (parts.length !== 2) return null;
  const role = parts[0]?.trim();
  const username = parts[1]?.trim();
  if (!role || !username) return null;
  return { role, username };
}
