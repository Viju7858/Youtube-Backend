import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const getAllVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, shortBy, shortType, userId } = req.query;
  // TODO get All videos based on query , short ,pagintion
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //TODO: get video , uplod on coludinary create video
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // multer se file ayegi
  const videoLocalPath = req.file?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  // upload video on cloudinary
  const uploadVideo = await uploadOnCloudinary(videoLocalPath);
  if (!uploadVideo) {
    throw new ApiError(500, "Failed to upload video");
  }

  // DB Save
  const video = await Video.create({
    title,
    description,
    videoFile: uploadVideo.url,
    owner: req.user._id,
    duration: uploadVideo.duration || 0,
    thumbnail: uploadVideo.secure_url,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: get video by Id
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: update video details like , title, description, thumbnail
});

const deleteVideo = asyncHandler(async (req, res) => {
  // TODO: delete video by id
  const { videoId } = req.params;
  console.log(typeof videoId);

  const video = await Video.findById(videoId);
  console.log("type", typeof video);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  const user = await User.findById(req.user._id);
  console.log(user);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const deletedVideo = await Video.findByIdAndDelete(videoId);
  console.log(deletedVideo);

  user.videos = user.videos.filter(
    (id) => id.toString() !== deletedVideo._id.toString()
  );
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, deletedVideo, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: toggle publish status of video
});

export {
  getAllVideo,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
