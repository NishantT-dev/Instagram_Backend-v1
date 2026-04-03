import express from "express";
import http from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { initSocket } from "./socket.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(errorHandler);

app.use("/api/users", userRouter);
app.use("/api/auth/posts", postRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

server.listen(8080, () => console.log("Server running on port 8080"));

export { app };
