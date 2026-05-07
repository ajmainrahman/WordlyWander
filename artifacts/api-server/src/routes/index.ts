import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import destinationsRouter from "./destinations";
import galleryRouter from "./gallery";
import adminAuthRouter from "./admin/auth";
import adminPostsRouter from "./admin/posts";
import adminDestinationsRouter from "./admin/destinations";
import adminGalleryRouter from "./admin/gallery";

const router: IRouter = Router();

// Health
router.use(healthRouter);

// Public routes
router.use("/posts", postsRouter);
router.use("/destinations", destinationsRouter);
router.use("/gallery", galleryRouter);

// Admin routes
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/posts", adminPostsRouter);
router.use("/admin/destinations", adminDestinationsRouter);
router.use("/admin/gallery", adminGalleryRouter);

export default router;
