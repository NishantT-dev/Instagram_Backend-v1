import dotenv from "dotenv";
import db_conn from "./config/db.js";
import { app } from "./app.js";
import logger from "./utils/logger.js";
dotenv.config();
db_conn();

app.get("/", (req, res) => {
  res.send("Demo Page");
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logger.info(` Server Running at PORT ${PORT}`);
});
