import Post from "../models/postModel.js";
import Comment from "../models/commentModel.js";
import { postValidation } from "../middleware/validationMiddleware.js";
import Like from "../models/likeModel.js";
import User from "../models/userModel.js";
import Reply from "../models/replyModel.js";
import Follow from "../models/followModel.js";
import { getIO } from "../socket.js";

const createPost = async (req, res, next) => {
  try {
    const { error, value } = postValidation.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { title, description, images, postType } = value;
    const userId = req.user.id;

    const post = await Post.create({
      userId,
      title,
      description,
      images,
      postType,
    });
    const followers = await Follow.find({ followedId: userId }).select(
      "followerId",
    );
    const io = getIO(); // get initialized socket instance
    followers.forEach((f) => {
      console.log("Emitting to follower:", f.followerId.toString());
      io.to(f.followerId.toString()).emit("newPostNotification", {
        PostId: post._id,
        Author: userId,
        Title: post.title,
        Type: post.type,
        Message: "New post created!",
      });
    });

    return res
      .status(201)
      .json({ success: true, message: "Post created successfully", post });
  } catch (err) {
    next(err);
  }
};
const getAllPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({ userId, isDeleted: false })
      .sort({ createdAt: -1 }) // -1=descending order , +1=ascending order
      .populate("userId", "userName email"); // include user info in posts
    return res.status(200).json({
      message: "User Posts fetched Successfully",
      count: posts.length,
      posts,
    });
  } catch (err) {
    next(err);
  }
};
const getFilteredPosts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postType } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = { isDeleted: false };
    // validation on postType (only valid postType will get correct results (200))
    const validPostTypes = [
      "lifestyle",
      "fitness",
      "entertainment",
      "devotional",
      "gaming",
      "sports",
    ];
    if (postType) {
      if (!validPostTypes.includes(postType)) {
        return res.status(400).json({
          success: false,
          message: `Invalid postType. Allowed values are: ${validPostTypes.join(", ")}`,
        });
      }
      filter.postType = postType;
    }
    if (postType) {
      filter.postType = postType;
    }
    if (userId) {
      filter.userId = userId;
    }
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "userName");

    const total = await Post.countDocuments(filter);
    return res.status(200).json({
      message: ` Posts fetched successfully (Post Type = ${postType})`,
      page,
      limit,
      total,
      posts,
    });
  } catch (err) {
    next(err);
  }
};
const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndUpdate(
      postId,
      { isDeleted: true },
      { returnDocument: "after" },
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: " Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};

const likePost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Required post not found" });
    }

    const existingLike = await Like.findOne({ userId, postId });
    if (existingLike) {
      return res
        .status(400)
        .json({ success: false, message: "Already liked this post" });
    }

    const like = new Like({ userId, postId });
    await like.save();
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { totalLikes: 1 } },
      { returnDocument: "after" },
    );

    return res.status(201).json({
      success: true,
      message: "Post liked successfully",
      totalLikes: updatedPost.totalLikes,
    });
  } catch (err) {
    next(err);
  }
};

const commentPost = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { postId } = req.params;
    const { text } = req.body;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "post not found" });
    }
    const comment = new Comment({ userId, postId, text });
    await comment.save();
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $inc: { totalComments: 1 } },
      { returnDocument: "after" },
    );
    return res.status(201).json({
      cuccess: true,
      message: " Comment added successfully on post",
      comment,
      TotalComments: updatedPost.totalComments,
    });
  } catch (err) {
    next(err);
  }
};
const getPostComments = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId, isDeleted: false })
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Reply.find({
          commentId: comment._id,
          isDeleted: false,
        })
          .populate("replyBy", "userName email")
          .sort({ createdAt: -1 });

        return {
          ...comment.toObject(),
          replies,
        };
      }),
    );

    res.status(200).json({
      success: true,
      count: commentsWithReplies.length,
      comments: commentsWithReplies,
    });
  } catch (err) {
    next(err);
  }
};

const createreply = async (req, res, next) => {
  try {
    const replyBy = req.user.id;
    const { commentId, text } = req.body;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const user = await User.findById(replyBy);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const reply = await Reply.create({ commentId, replyBy, text });
    res.status(201).json({
      success: true,
      message: " Reply added successfully to comment",
      reply,
    });
  } catch (err) {
    next(err);
  }
};
const getRepliesByComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    const replies = await Reply.find({ commentId, isDeleted: false })
      .populate("replyBy", "userName email")
      .sort({ createdAt: -1 });
    res.status(200).json({ count: replies.length, replies });
  } catch (err) {
    next(err);
  }
};
const deleteReply = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const reply = await Reply.findByIdAndUpdate(replyId, {
      isDeleted: true,
      returnDocument: "after",
    });
    if (!reply) {
      return res.status(404).json({ message: " Reply not found" });
    }
    res.status(200).json({ message: " Reply deleted successfully" });
  } catch (err) {
    next(err);
  }
};
export {
  createPost,
  getAllPosts,
  getFilteredPosts,
  deletePost,
  likePost,
  commentPost,
  getPostComments,
  createreply,
  getRepliesByComment,
  deleteReply,
};
