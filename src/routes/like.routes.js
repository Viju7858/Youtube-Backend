import express from "express";
import likeVideo from "../controllers/like.controllers";

const router = express.Router();

router.post("/like/:videoId", likeVideo);

export default router;
