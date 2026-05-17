import { Request, Response, NextFunction } from "express";
import { verifyAdminToken, AdminPayload } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayload;
    }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  let token: string | undefined;

  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token) {
    token = req.cookies?.["admin_token"];
  }

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
