import redisClient from "../config/redis.js";
import transporter from "../utils/mailer.js";

export const sendOtpEmail = async (email) => {
  // To generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store OTP in Redis with 5 min expiry
  await redisClient.set(`otp:${email}`, otp, { EX: 300 });

  // Send mail 
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  });

  console.log(` OTP sent to ${email}`);
  return otp;
};

export const verifyOtpEmail = async (email, userInput) => {
  const storedOtp = await redisClient.get(`otp:${email}`);
  if (!storedOtp)
    return { success: false, message: "OTP expired or not found" };
  if (storedOtp === userInput) {
    await redisClient.del(`otp:${email}`);
    return { success: true, message: "OTP verified successfully" };
  }
  return { success: false, message: "Invalid OTP" };
};
