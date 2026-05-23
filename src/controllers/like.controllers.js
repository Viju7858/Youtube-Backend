import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Like } from "../models/Like.model.js";
import { ApiError } from "../utils/ApiError.js";

const showAllLikes = asyncHandler(async (req, res) => {
  const allLike = await Like.find({
    video: "686b123456789abcd1234567",
  }).populate("likedBy", "name email");
  res
    .status(200)
    .json(new ApiResponse(200, allLike, "All Likes Retrieved Successfully"));
});

const likeVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = "686b123456789abcd1234567"; // Replace with actual video ID from request parameters
  const userId = req.user._id; // Replace with actual user ID from authentication;

  // Check if the user has already liked the video
  const existingLike = await Like.findOne({ video: video, likedBy: userId });
  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);

    const totalLikes = await Like.countDocuments({ video: video });
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
  await Like.create({ video: video, likedBy: userId });
  const totalLikes = await Like.countDocuments({ video: video });
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
  const video = "686b123456789abcd1234567"; // Replace with actual video ID from request parameters
  const totalLikes = await Like.countDocuments({ video: video });
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
