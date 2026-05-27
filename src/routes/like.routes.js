import express from "express";

import {
  likeCount,
  likeVideo,
  showAllLikes,
} from "../controllers/like.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/like/:videoId").post(verifyJWT, likeVideo);
router.route("/likes/:videoId").get(verifyJWT, showAllLikes);
router.route("/likes/:videoId/count").get(likeCount);

export default router;
