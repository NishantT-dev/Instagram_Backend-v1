import express from "express";
import {
  commentPost,
  createPost,
  createreply,
  deletePost,
  deleteReply,
  getAllPosts,
  getFilteredPosts,
  getPostComments,
  getRepliesByComment,
  likePost,
} from "../controller/postController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";
import {
  createNotification,
  getNotifications,
} from "../controller/notificationController.js";
const postRouter = express.Router();

// Post related routes
postRouter.post("/", jwtMiddleware, createPost);
postRouter.get("/my-posts", jwtMiddleware, getAllPosts);
postRouter.get("/", jwtMiddleware, getFilteredPosts); // filter posts acc. to postType

// Post action (comment,like,reply) related routes
postRouter.post("/:postId/comment", jwtMiddleware, commentPost);
postRouter.get("/:postId/comments", jwtMiddleware, getPostComments);
postRouter.post("/:postId/like", jwtMiddleware, likePost);
postRouter.get("/:commentId", jwtMiddleware, getRepliesByComment);
postRouter.post("/reply", jwtMiddleware, createreply);
postRouter.delete("/:replyId", jwtMiddleware, deleteReply);

// Post notification related routes
postRouter.post("/notification", jwtMiddleware, createNotification);
postRouter.get("/notifications", jwtMiddleware, getNotifications);

export default postRouter;
