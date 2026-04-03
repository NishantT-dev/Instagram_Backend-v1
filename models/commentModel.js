import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Reply of comment - UserId, replyByUser (furthur addition)
  },
  {
    timestamps: true,
  },
);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
