import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/Like.model.js";
import { ApiError } from "../utils/ApiError.js";

const showAllLikes = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const allLike = await Like.find({
    video: videoId,
  }).populate("likedBy", "name email");
  res
    .status(200)
    .json(new ApiResponse(200, allLike, "All Likes Retrieved Successfully"));
});

const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id; // Replace with actual user ID from authentication;

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({ video: videoId, likedBy: userId });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const totalLikes = await Like.countDocuments({ video: videoId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { likeCount: totalLikes },
          "Video Unliked Successfully"
        )
      );
  }
  await Like.create({ video: videoId, likedBy: userId });
  const totalLikes = await Like.countDocuments({ video: videoId });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likeCount: totalLikes },
        "Video Liked Successfully"
      )
    );
});

const likeCount = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const totalLikes = await Like.countDocuments({ video: videoId });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { likeCount: totalLikes },
        "Like Count Retrieved Successfully"
      )
    );
});

export { likeVideo, showAllLikes, likeCount };
