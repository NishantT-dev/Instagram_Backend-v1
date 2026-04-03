import mongoose from "mongoose";
const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    images: [
      {
        imageUrl: {
          type: String,
          default: null,
        },
        imageCaption: {
          type: String,
          required: false,
          default: "No Caption of image",
        },
      },
    ],
    postType: {
      type: String,
      enum: [
        "lifestyle",
        "fitness",
        "entertainment",
        "devotional",
        "gaming",
        "sports",
      ],
      default: "lifestyle",
    },
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const Post = mongoose.model("Post", postSchema);
export default Post;
