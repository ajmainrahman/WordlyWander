import jwt from "jsonwebtoken";

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET is not set");
  return s;
}

export interface AdminPayload {
  sub: string;
  email: string;
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyAdminToken(token: string): AdminPayload {
  return jwt.verify(token, getSecret()) as AdminPayload;
}
