import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userValidation } from "../middleware/validationMiddleware.js";
import Follow from "../models/followModel.js";
import redisClient from "../config/redis.js";
import transporter from "../utils/mailer.js";

const registerUser = async (req, res, next) => {
  try {
    const { email, password, userName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
      isVerified: false,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in Redis with expiry
    await redisClient.set(`otp:${email}`, otp, { EX: 300 });
    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your account",
      text: `Dear Recipient,
We are sending you this message to provide your One-Time Password (OTP) for authentication purposes. Your OTP is: ${otp}. 
Please note that for security reasons, this OTP is valid for a duration of 5 minutes from the time of issuance.
 After the 5-minute validity period, the OTP will expire and a new one must be requested should you require reconfirmation.
We highly recommend keeping this information confidential and refraining from sharing it with anyone.
 If you did not request this OTP, please contact our support team immediately.
Thank you for your attention and cooperation.`,
    });

    res.status(201).json({
      message:
        "User registered. OTP sent to email. (After verifying OTP, User will get verified)",
      userId: user._id,
    });
  } catch (err) {
    next(err);
  }
};
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const storedOtp = await redisClient.get(`otp:${email}`);
    if (!storedOtp)
      return res.status(400).json({ message: "OTP expired or not found" });

    if (storedOtp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // Mark user as verified
    const updateUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );

    // Remove OTP from Redis
    await redisClient.del(`otp:${email}`);

    res.status(200).json({ message: "User verified successfully", updateUser });
  } catch (err) {
    next(err);
  }
};
const loginUser = async (req, res, next) => {
  try {
    const { error, value } = userValidation.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "User not verified or invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "15d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", accessToken });
  } catch (err) {
    next(err);
  }
};
const refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { followedId } = req.body;
    if (followerId === followedId) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    const follower = await User.findById(followerId);
    const followed = await User.findById(followedId);

    if (!follower || !followed) {
      return res.status(404).json({ message: "User not found" });
    }
    const follow = await Follow.create({ followerId, followedId });
    res
      .status(201)
      .json({ success: true, message: "User Followed Successfully", follow });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already following this user." });
    }
    next(err);
  }
};
const unfollowUser = async (req, res, next) => {
  try {
    const { followerId, followedId } = req.body;

    const unfollow = await Follow.findOneAndDelete({ followerId, followedId });

    if (!unfollow) {
      return res
        .status(404)
        .json({ message: "Follow relationship not found." });
    }

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (err) {
    next(err);
  }
};
const getFollowers = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const followers = await Follow.find({ followedId: userId }).populate(
      "followerId",
      "userName email",
    );
    res.status(200).json({ count: followers.length, followers });
  } catch (err) {}
};
const getFollowing = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ followerId: userId }).populate(
      "followedId",
      "userName email",
    );
    res.status(200).json({ count: following.length, following });
  } catch (err) {
    next(err);
  }
};
export {
  registerUser,
  loginUser,
  refreshAccessToken,
  verifyOtp,
  // logoutUser,
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
};
