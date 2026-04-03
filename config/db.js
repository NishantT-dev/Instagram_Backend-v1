import mongoose from "mongoose";
import logger from "../utils/logger.js";

const db_conn = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    logger.info(` Database connected successfully `);
  } catch (err) {
    logger.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

export default db_conn;
