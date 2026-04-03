# 📸 Instagram Backend (version 01-Redis, BullMQ,Nodemailer)

A backend service for an Instagram‑style application built with Node.js, Express, MongoDB, Redis, BullMQ,Nodemailer, and JWT authentication.

##  Features
- **User Authentication**
  - Register new users with email & password
  - OTP verification via email (Redis + Nodemailer)
  - Secure login with JWT access & refresh tokens

- **User Management**
  - Follow / Unfollow users
  - Get followers list
  - Get following list

- **Posts & Interactions**
  - Create, delete, and filter posts
  - Like posts
  - Comment on posts
  - Reply to comments
  - Get all comments and replies

- **Notifications**
  - Create notifications
  - Fetch notifications for a user

- **Security**
  - Rate limiting on login
  - Password hashing with bcrypt
  - Verified users only allowed to log in

- **Infrastructure**
  - Redis for OTP storage and expiry
  - BullMQ for background job queue (sending OTP emails)
  - Nodemailer for email delivery

###  This diagram illustrates the database relationships between entities such as User, Post, Like, Comment, Reply, Follow, and Notification in Instagram-style backend system.
<img width="970" height="697" alt="image" src="https://github.com/user-attachments/assets/24775aea-b6a0-40f4-b79e-b55d2178a22f" />

##  API Endpoints
###  Authentication
- `POST /users` → Register user (creates account, sends OTP)
- `POST /users/verify-otp` → Verify OTP and verify account
- `POST /users/auth/login` → Login with email & password (rate limited)

### 👥 User Actions
- `POST /users/follow` → Follow another user (JWT required)
- `POST /users/unfollow` → Unfollow a user (JWT required)
- `GET /users/:userId/followers` → Get list of followers (JWT required)
- `GET /users/:userId/following` → Get list of following (JWT required)

### 📝 Posts
- `POST /posts` → Create a new post (JWT required)
- `GET /posts/my-posts` → Get all posts by logged‑in user
- `GET /posts` → Get filtered posts (by postType)
- `DELETE /posts/:postId` → Delete a post
- `POST /posts/:postId/like` → Like a post
- `POST /posts/:postId/comment` → Add a comment to a post
- `GET /posts/:postId/comments` → Get all comments for a post
- `POST /posts/reply` → Reply to a comment
- `GET /posts/:commentId` → Get replies for a comment
- `DELETE /posts/:replyId` → Delete a reply

### 🔔 Notifications
- `POST /posts/notification` → Create a notification
- `GET /posts/notifications` → Get all notifications for a user

### POST User (User created, When user enters OTP then User is verified)
<img width="944" height="407" alt="image" src="https://github.com/user-attachments/assets/c42b56df-6067-401b-91a2-dd08e22e6229" />
<img width="944" height="322" alt="image" src="https://github.com/user-attachments/assets/16e54277-61c1-4237-87e8-be28327d8e66" />

### POST User Verify OTP (marks user as verified in DB).
<img width="944" height="665" alt="image" src="https://github.com/user-attachments/assets/a6b94341-dd6c-4d6c-aafe-3d078b12b994" />

### POST Post (When user creates a Post then followers notifies (web sockets))
<img width="1059" height="921" alt="image" src="https://github.com/user-attachments/assets/ef0ca3d6-5194-4357-b749-4f9f641c57dd" />

<img width="795" height="217" alt="image" src="https://github.com/user-attachments/assets/4c0c3dfc-9658-4581-a734-dd4882ef0aee" />
