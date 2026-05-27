import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { deleteVideo, publishVideo } from "../controllers/video.controllers.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/publish").post(verifyJWT, upload.single("video"), publishVideo);
router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);

export default router;
