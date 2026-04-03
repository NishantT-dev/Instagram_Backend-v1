import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "semiAdmin", "user"],
      default: "user",
      required: true,
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    isVerified:{
      type:Boolean,
    default:false    }
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("User", userSchema);
export default User;
