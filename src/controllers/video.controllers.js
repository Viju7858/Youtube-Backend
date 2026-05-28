import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, shortBy, shortType, userId } = req.query;
  // TODO get All videos based on query , short ,pagintion
  const filter = {};
  if (query) {
    filter.title = { $regex: query, $options: "i" };
  }
  if (userId) {
    filter.owner = userId;
  }
  const sortOptions = {};
  if (shortBy && shortType) {
    sortOptions[shortBy] = shortType === "asc" ? 1 : -1;
  }

  const skip = (page - 1) * limit;

  const videos = await Video.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit));
  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //TODO: get video , uplod on coludinary create video
  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  // multer se file ayegi
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath) {
    throw new ApiError(400, "Video file is required");
  }

  // upload video on cloudinary
  const uploadVideo = await uploadOnCloudinary(videoLocalPath);
  if (!uploadVideo) {
    throw new ApiError(500, "Failed to upload video");
  }

  let uploadThumbnail;

  if (thumbnailLocalPath) {
    uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  }

  // DB Save
  const video = await Video.create({
    title,
    description,
    videoFile: uploadVideo.secure_url,
    owner: req.user._id,
    duration: uploadVideo.duration || 0,
    thumbnail: uploadThumbnail?.url || "",
  });
  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: get video by Id

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  );
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  await video.save();
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  // TODO: update video details like , title, description, thumbnail

  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  let videoUrl;
  let thumbnaliUrl;
  let duration;

  if (videoLocalPath) {
    const uploadVideo = await uploadOnCloudinary(videoLocalPath);
    videoUrl = uploadVideo.url;
    duration = uploadVideo.duration || 0;
  }

  if (thumbnailLocalPath) {
    const uploadThumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    thumbnaliUrl = uploadThumbnail.url;
  }

  const updateData = await Video.findByIdAndUpdate(
    videoId,
    {
      ...req.body,
      ...(videoUrl && { videoFile: videoUrl }),
      ...(thumbnaliUrl && { thumbnail: thumbnaliUrl }),
      ...(duration && { duration: duration }),
    },
    { new: true }
  );

  if (!updateData) {
    throw new ApiError(404, "Video not found");
  }
  return res.json(
    new ApiResponse(200, updateData, "Video Update Successfully")
  );
});

const deleteVideo = asyncHandler(async (req, res) => {
  // TODO: delete video by id
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
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
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  if (video.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(
      403,
      "You are not authorized to change publish status of this video"
    );
  }
  video.isPublished = !video.isPublished;
  await video.save();
  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video publish status toggled successfully")
    );
});
export {
  getAllVideos,
  publishVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
