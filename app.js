import express from "express";
import http from "http";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import { initSocket } from "./socket.js";

const app = express();

// app level middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(errorHandler);

// User routes
app.use("/api/users", userRouter);

// Post routes (jwt auth req.)
app.use("/api/auth/posts", postRouter);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

const server = http.createServer(app);

// Initialize Socket.IO
initSocket(server);

export { app };
