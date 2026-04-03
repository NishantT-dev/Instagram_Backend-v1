import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
const createNotification = async (req, res, next) => {
  try {
    const { userId, triggeredBy, type, postId, commentId } = req.body;
    if (userId === triggeredBy) {
      return res.status(400).json({ message: "You cannot notify yourself" });
    }
    const receiver = await User.findById(userId);
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    if (postId) {
      const post = await Post.findById(postId);
      if (!post || post.isDeleted) {
        return res.status(404).json({ message: "Post not found or deleted" });
      }
    }
    if (commentId) {
      const comment = await Comment.findById(commentId);
      if (!comment || comment.isDeleted) {
        return res
          .status(404)
          .json({ message: "Comment not found or deleted" });
      }
    }
    const existing = await Notification.findOne({
      userId,
      triggeredBy,
      type,
      postId,
      commentId,
    });
    if (existing) {
      return res.status(400).json({ message: "Notification Already exists" });
    }
    const notification = await Notification.create({
      userId,
      triggeredBy,
      type,
      postId,
      commentId,
    });
    res
      .status(201)
      .json({
        success: true,
        message: "Notification created successfully",
        notification,
      });
  } catch (err) {
    next(err);
  }
};

const getNotifications = async (req, res, next) => {
  try {
    const { userId } = req.user._id;
    const notifications = await Notification.find({ userId })
      .populate("triggeredBy", "userName email")
      .populate("postId", "title")
      .populate("commentId", "text")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: notifications.length, notifications });
  } catch (err) {
    next(err);
  }
};

export { createNotification, getNotifications };
