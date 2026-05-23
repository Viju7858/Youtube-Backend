import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { Like } from "../models/Like.model";
import { ApiError } from "../utils/ApiError";

const likeVideo = asyncHandler(async (req, res, next) => {
  const { videiId } = res.body;
  const newLike = await Like.create({
    videiId,
    owner: "686b123456789abcd1234567",
  });
  res
    .status(200)
    .json(new ApiResponse(200, newLike, "Video Liked Successfully"));
});

export { likeVideo };
