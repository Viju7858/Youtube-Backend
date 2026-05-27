import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getVideoComments = asyncHandler(async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const comments = await Comment.find({ video: videoId });

    res.status(200).json({
      ApiResponse: new ApiResponse(
        true,
        "Comment fetched successfully",
        comments
      ),
    });
  } catch (error) {
    throw new ApiError(error.message, 500);
  }
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add comment to video
  const { content, videoId } = req.body;
  if (!content || !videoId) {
    throw new ApiError("Content and videoId are Required", 400);
  }
  const newComment = await Comment.create({
    content,
    video: videoId,
    commentedBy: req.user._id,
  });

  res.status(201).json({
    ApiResponse: new ApiResponse(
      201,
      "Comment added successfully",
      newComment
    ),
  });
});

const updateComment = asyncHandler(async (req, res) => {
  //TODO: update comment
  const { commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    throw new ApiError("Content is Required", 400);
  }
  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );
  if (!updateComment) {
    throw new ApiError("Comment not found", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, updateComment, "Comment Update Successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const deleteComment = await Comment.findByIdAndDelete(commentId);
  if (!deleteComment) {
    throw new ApiError("Comment not found", 404);
  }
  res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment Deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
