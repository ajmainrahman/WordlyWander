import { Router, type IRouter } from "express";
import healthRouter from "./health";
import postsRouter from "./posts";
import destinationsRouter from "./destinations";
import galleryRouter from "./gallery";
import newsletterRouter from "./newsletter";
import statsRouter from "./stats";
import bucketListRouter from "./bucket-list";
import siteSettingsRouter from "./site-settings";
import storageRouter from "./storage";
import adminAuthRouter from "./admin/auth";
import adminPostsRouter from "./admin/posts";
import adminDestinationsRouter from "./admin/destinations";
import adminGalleryRouter from "./admin/gallery";
import adminBucketListRouter from "./admin/bucket-list";
import adminSiteSettingsRouter from "./admin/site-settings";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/posts", postsRouter);
router.use("/destinations", destinationsRouter);
router.use("/gallery", galleryRouter);
router.use(newsletterRouter);
router.use("/stats", statsRouter);
router.use("/bucket-list", bucketListRouter);
router.use("/site-settings", siteSettingsRouter);
router.use(storageRouter);
router.use("/admin/auth", adminAuthRouter);
router.use("/admin/posts", adminPostsRouter);
router.use("/admin/destinations", adminDestinationsRouter);
router.use("/admin/gallery", adminGalleryRouter);
router.use("/admin/bucket-list", adminBucketListRouter);
router.use("/admin/site-settings", adminSiteSettingsRouter);

export default router;
