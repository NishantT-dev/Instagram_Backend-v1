// Environment variables
import dotenv from "dotenv";

// Custom modules
import db_conn from "./config/db.js";
import { app } from "./app.js";
import logger from "./utils/logger.js";

dotenv.config(); 

db_conn();

// Health check route
app.get("/health", (req, res) => {
  res.send("Server is running smoothly");
});

const PORT = process.env.PORT || 8080;

// Start server at port 8080
app.listen(PORT, () => {
  logger.info(` Server Running at PORT ${PORT}`);
});
