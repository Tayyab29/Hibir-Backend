require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/databse");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/authRoute");
const userRouter = require("./routes/UserRoute");
require("./utils/passport");

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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
