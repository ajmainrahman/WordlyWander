import { Request, Response, NextFunction } from "express";
import { verifyAdminToken, type AdminPayload } from "../lib/jwt";

export interface AuthedRequest extends Request {
  admin?: AdminPayload;
}

export function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.["admin_token"] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
