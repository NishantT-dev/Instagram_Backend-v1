import express from "express";
import {
  followUser,
  getFollowers,
  getFollowing,
  loginUser,
  // logoutUser,
  refreshAccessToken,
  registerUser,
  unfollowUser,
  verifyOtp,
} from "../controller/userController.js";
import jwtMiddleware from "../middleware/jwtMiddleware.js";
import { loginLimiter } from "../middleware/rateLimitMiddleware.js";
import { sendOtpEmail, verifyOtpEmail } from "../services/otpServices.js";
const userRouter = express.Router();

userRouter.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  const otp = await sendOtpEmail(email);
  res.json({ message: "OTP sent", otp });
});

// Verify OTP
userRouter.post("/verify-otp", verifyOtp);

userRouter.post("/", registerUser);
userRouter.post("/auth/login", loginLimiter, loginUser);
userRouter.post("/auth/refresh-token", refreshAccessToken);

userRouter.post("/follow", jwtMiddleware, followUser);
userRouter.post("/unfollow", jwtMiddleware, unfollowUser);

userRouter.get("/:userId/followers", jwtMiddleware, getFollowers);
userRouter.get("/:userId/following", jwtMiddleware, getFollowing);
export default userRouter;
