import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const otpQueue = new Queue("otpQueue", { connection: redisConnection });
