import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
  getVideoComments,
} from "../controllers/comment.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/add-comment").post(verifyJWT, addComment);
router.route("/update-comment/:commentId").patch(verifyJWT, updateComment);
router.route("/get-comment/video/:videoId").get(getVideoComments);
router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment);

export default router;
