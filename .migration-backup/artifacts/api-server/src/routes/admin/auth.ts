import { Router } from "express";
import { signAdminToken } from "../../lib/jwt";
import { requireAdmin } from "../../middlewares/auth";

const router = Router();

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    res.status(500).json({ error: "Admin credentials not configured" });
    return;
  }
  if (!email || !password || email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = signAdminToken({ sub: "admin", email });
  res.cookie("admin_token", token, COOKIE_OPTS);
  res.json({ ok: true, email });
});

router.post("/logout", (_req, res) => {
  res.clearCookie("admin_token");
  res.json({ ok: true });
});

router.get("/me", requireAdmin, (req, res) => {
  res.json({ email: req.admin?.email });
});

export default router;
