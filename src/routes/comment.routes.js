import express from "express";
import {
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controllers.js";

const router = express.Router();

router.post("/add-comment", addComment);
router.patch("/update-comment/:commentId", updateComment);
router.delete("/delete-comment/:commentId", deleteComment);

export default router;
