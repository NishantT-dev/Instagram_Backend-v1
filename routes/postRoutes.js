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

postRouter.post("/", jwtMiddleware, createPost);
postRouter.get("/my-posts", jwtMiddleware, getAllPosts);
postRouter.get("/", jwtMiddleware, getFilteredPosts); // filter posts acc. to postType

postRouter.delete("/:postId", jwtMiddleware, deleteReply);
postRouter.post("/:postId/like", jwtMiddleware, likePost);

postRouter.post("/:postId/comment", jwtMiddleware, commentPost);
postRouter.get("/:postId/comments", jwtMiddleware, getPostComments);
postRouter.post("/reply", jwtMiddleware, createreply);
postRouter.get("/:commentId", jwtMiddleware, getRepliesByComment);
postRouter.delete("/:replyId", jwtMiddleware, deletePost);

postRouter.post("/notification", jwtMiddleware, createNotification);
postRouter.get("/notifications", jwtMiddleware, getNotifications);

export default postRouter;
