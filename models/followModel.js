import mongoose from "mongoose";
const followSchema = new mongoose.Schema(
  {
    followerId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    followedId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);
// Below is to prevent duplicate follow (ek user kisi aur ko sirf ek bar hi follow kar sakta hai)
followSchema.index({ followerId: 1, followedId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", followSchema);
export default Follow;
