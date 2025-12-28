import express from "express";
import {
  createUrl,
  DeleteAllUsersUrl,
  DeleteUrl,
  getAllUrl,
  getUrl,
  getUrlByUser,
} from "../controllers/url.controller";

const router = express.Router();

// To Create new link
router.post("/shorturl", createUrl);

// To Get all the links
router.post("/shorturl/user", getUrlByUser);

// To Get all the links
router.get("/shorturl", getAllUrl);

// To Delete a route
router.get("/deleteshorturl/:id", DeleteUrl);

// To Delete all links from a user
router.get("/deleteusersurl/:userid", DeleteAllUsersUrl);

// To get Details of a Specifc link
router.get("/shorturl/:id", getUrl);

export default router;
