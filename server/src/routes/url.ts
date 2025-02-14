import express from "express";
import {
  createUrl,
  DeleteUrl,
  getAllUrl,
  getUrl,
} from "../controllers/url.controller";

const router = express.Router();

// To Create new link
router.post("/shorturl", createUrl);

// To Get all the links
// TODO : update link count on getUrl
router.get("/shorturl", getAllUrl);

// To Delete a route
router.get("/deleteshorturl/:id", DeleteUrl);

// To get Details of a Specifc link
router.get("/shorturl/:id", getUrl);

export default router;
