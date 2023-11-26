require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/databse");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const userRouter = require("./routes/UserRoute");
const zipRouter = require("./routes/ZipCountryRoute");
const chatRouter = require("./routes/ChatRoute");
const messageRouter = require("./routes/MeassageRoute");
const notificationRouter = require("./routes/NotificationRoute");

require("./utils/passport");
const { v4: uuidv4 } = require("uuid");

const passport = require("passport");
const advertiseRouter = require("./routes/AdvertiseRoute");

const app = express();

const port = process.env.PORT;
connectDB();

// Use cookie-parser middleware to parse cookies
app.use(cookieParser());

// Configure express-session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY, // Replace with a strong, random secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false, // Set to true in production if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // Session expiration time (1 day)
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "*",
    // origin: "http://localhost:3000",
  })
);

app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1/users", userRouter); //User Route
app.use("/api/v1/advertise", advertiseRouter); //User Route
app.use("/api/v1/auth", authRoute); // Google Auth
app.use("/api/v1/genral", zipRouter); // Zipcode and Country Route
app.use("/api/v1/chat", chatRouter); // Chat Route
app.use("/api/v1/message", messageRouter); // Chat Route
app.use("/api/v1/notification", notificationRouter); // Notification Route

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "*",
    origin: "http://localhost:3000",
    // credentials: true,
  },
});
let activeUsers = [];
// Function to emit the list of online users
const emitOnlineUsers = () => {
  io.emit("get-users", activeUsers);
};

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  // add new User
  socket.on("new-user-add", (newUserId) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({ userId: newUserId, socketId: socket.id });
      console.log("New User Connected", activeUsers);
    }
    // send all active users to new user
    emitOnlineUsers();

    // io.emit("get-users", activeUsers);
  });

  socket.on("disconnect", () => {
    // remove user from active users
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    // send all active users to all users
    emitOnlineUsers();

    // io.emit("get-users", activeUsers);
  });

  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeUsers.find((user) => user.userId === receiverId);

    if (user) {
      const random = uuidv4();
      let notify = {
        receiverId,
        random,
      };
      io.to(user.socketId).emit("recieve-message", data);
      io.to(user.socketId).emit("recieve-notification", notify);
    }
  });
  // Event listener for get-users
  socket.on("get-users", () => {
    emitOnlineUsers();
  });
});
