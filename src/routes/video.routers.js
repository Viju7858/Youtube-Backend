import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  deleteVideo,
  publishVideo,
  updateVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
} from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/publish").post(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishVideo
);
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);
router.route("/update/:videoId").patch(
  verifyJWT,
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  updateVideo
);
router.route("/getAllVideos").get(getAllVideos);
router.route("/watch/:videoId").get(getVideoById);
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);
export default router;
