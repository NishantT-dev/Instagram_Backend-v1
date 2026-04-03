import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

socket.emit("register", "FOLLOWER_USER_ID");

socket.on("newPostNotification", (data) => {
  console.log("Notification received:", data);
});
