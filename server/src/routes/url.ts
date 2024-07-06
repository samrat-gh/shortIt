import express from "express";
import { createUrl, getAllUrl } from "../controllers/url.controller";

const router = express.Router();

router.post("/shorturl", createUrl);
router.get("/shorturl", getAllUrl);
// router.post("/shorturl/:id");
// router.get("/shorturl/:id ");

export default router;
