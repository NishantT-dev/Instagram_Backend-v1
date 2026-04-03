import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import { redisConnection } from "../config/redis.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const otpWorker = new Worker(
  "otpQueue",
  async (job) => {
    const { email, otp } = job.data;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });
    console.log(`OTP sent to ${email}`);
  },
  { connection: redisConnection },
);
