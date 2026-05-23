import express from "express";

import {
  likeCount,
  likeVideo,
  showAllLikes,
} from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/like/:videoId", verifyJWT, likeVideo);
router.get("/likes/:videoId", verifyJWT, showAllLikes);
router.get("/likes/:videoId/count", likeCount);

export default router;
