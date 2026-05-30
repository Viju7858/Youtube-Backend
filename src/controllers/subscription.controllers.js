import mongoose from "mongoose";
import { Subscription } from "../models/subsciption.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  const subscriberId = req.user._id;

  if (channelId == subscriberId.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const channel = await User.findById(channelId);
  if (!channel) {
    throw new ApiError(404, "Channel not found");
  }

  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: subscriberId,
  });

  if (subscription) {
    await Subscription.findByIdAndDelete(subscription._id);
    return res
      .status(200)
      .json(new ApiResponse(true, {}, "Unsubscribed successfully"));
  }

  await Subscription.create({
    channel: channelId,
    subscriber: subscriberId,
  });

  const subscriberCount = await Subscription.countDocuments({
    channel: channelId,
  });

  const subscribedChannelsCount = await Subscription.countDocuments({
    subscriber: subscriberId,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        true,
        { subscriberCount, subscribedChannelsCount },
        "Subscribed successfully"
      )
    );
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  const channels = await User.find({
    subscribers: subscriberId,
  }).populate("channel", "username fullName avatar");
  return res
    .status(200)
    .json(
      new ApiResponse(200, channels, "Subscribed channels fetched successfully")
    );
});

export { toggleSubscription, getSubscribedChannels };
