import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnColudinary from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";

const getAllVideo = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, shortBy, shortType, userId } = req.query;
  // TODO get All videos based on query , short ,pagintion
});

const publishVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  //TODO: get video , uplod on coludinary create video
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
  const { videoId } = req.params;
  // TODO: delete video by id
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
