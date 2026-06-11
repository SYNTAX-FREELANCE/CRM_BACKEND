require("dotenv").config({ quiet: true });

const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");

const corsConfig = require("./config/cors");
const { initSocket } = require("./config/socket");

const app = express();
const server = http.createServer(app);

// Serve the C:\uploads folder at /uploads URL
app.use("/uploads", express.static("C:/uploads"));

// middlewares
app.use(cors(corsConfig));
app.use(express.json());

// init socket
initSocket(server);

// routes
const userRoutes = require("./api/UserContorller/usercontroller.router");
const routeTrackerMiddleware = require("./Middleware/routeTracker.middleware");
const socketMiddleware = require("./Middleware/socke.middlewar");
// socket allowed only here
app.use(
  "/api/user",
  routeTrackerMiddleware("USER_LOGIN_ROUTER"),
  socketMiddleware,
  userRoutes,
);

// health check
app.get("/health", (_, res) => res.send("OK"));

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
