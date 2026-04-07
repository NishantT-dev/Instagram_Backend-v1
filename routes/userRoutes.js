import express from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  loginUser,
  refreshAccessToken,
  registerUser,
  unfollowUser,
  verifyOtp,
} from "../controller/userController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";
import { sendOtpEmail, } from "../services/otpServices.js";
const userRouter = express.Router();

userRouter.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = await sendOtpEmail(email);
  res.json({ message: "OTP sent", otp });
});

// User registration related routes
userRouter.post("/", registerUser);
userRouter.post("/auth/login", loginLimiter, loginUser);
userRouter.post("/auth/refresh-token", refreshAccessToken);

// Verify OTP (for user verification)
userRouter.post("/verify-otp", verifyOtp);

// User follow related routes
userRouter.post("/follow", jwtMiddleware, followUser);
userRouter.post("/unfollow", jwtMiddleware, unfollowUser);
userRouter.get("/:userId/followers", jwtMiddleware, getFollowers);
userRouter.get("/:userId/following", jwtMiddleware, getFollowing);

export default userRouter;
