import { Router } from "express";
import {
  getSubscribedChannels,
  toggleSubscription,
} from "../controllers/subscription.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/:channelId").post(verifyJWT, toggleSubscription);
router
  .route("/subscribed-channels/:subscriberId")
  .get(verifyJWT, getSubscribedChannels);

export default router;
