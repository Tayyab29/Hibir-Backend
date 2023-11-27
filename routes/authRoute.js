const router = require("express").Router();
const passport = require("passport");

const User = require("../schemas/UserModel");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { default: axios } = require("axios");

const { CLIENT_ID, TOKEN_KEY } = process.env;
const client = new OAuth2Client(CLIENT_ID);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login/failed",
  }),
  async (req, res) => {
    // The user is authenticated via Google at this point.
    // You can access user information from req.user.

    // Check if the user already exists in your database based on some identifier like email.
    const existingUser = await User.findOne({ email: req.user.email });

    if (existingUser) {
      // Set a flash message indicating successful user creation.
      // req.flash("success", "User already exist");
      res.redirect(process.env.CLIENT_URL);
    } else {
      const newUser = new User({
        firstName: req.user.name.givenName,
        lastName: req.user.name.familyName,
        email: req.user.emails[0].value,
        password: "1",
        isGoogle: true,
      });
      // Initialize a response object
      const response = {
        success: false,
        message: "",
        redirectTo: process.env.CLIENT_URL,
      };

      // Save the new user to the database.
      try {
        await newUser.save();
        // Set a flash message indicating successful user creation.
        // req.flash("success", "User created successfully");
        response.success = true;
        response.message = "User created successfully";
        res.redirect(process.env.CLIENT_URL);
      } catch (error) {
        console.error("Error creating new user:", error);
        // Set a flash message indicating an error.
        // req.flash("error", "Internal server error");
        res.redirect(process.env.CLIENT_URL);
        // Provide an error message
        response.message = "Internal server error";
      }
      // Send the response as JSON
      res.status(response.success ? 200 : 500).json(response);
    }
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

// Handle Google Sign-In
router.post("/google", async (req, res) => {
  const { token } = req.body;
  const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });

  try {
    // For Google Login
    // const ticket = await client.verifyIdToken({
    //   idToken: token,
    //   audience: CLIENT_ID,
    // });

    // const payload = ticket.getPayload();
    // console.log({ payload });

    const googleEmail = userInfo.data.email;

    // Check if the user exists in your database by their Google Email
    const user = await User.findOne({ email: googleEmail });

    if (user) {
      if (user?.isActive) {
        // User exists, generate a JWT and send it with user details
        const access_token = jwt.sign({ user_id: user._id, email: user.email }, TOKEN_KEY, {
          expiresIn: "8h",
        });
        res.status(200).json({ status: true, user, access_token, account: true });
        return;
      } else {
        res.status(200).send({ status: true, message: "Deactivated Account", account: false });
        return;
      }
    } else {
      // User doesn't exist, create a new user in your database
      const newUser = new User({
        firstName: userInfo.data.given_name,
        lastName: userInfo.data.family_name,
        email: userInfo.data.email,
        password: "1",
        isGoogle: true,
      });

      await newUser.save();

      const access_token = jwt.sign({ user_id: user._id, email: userInfo.data.email }, TOKEN_KEY, {
        expiresIn: "8h",
      });
      res.status(200).json({ status: true, user: newUser, access_token, account: true });
    }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
});

// Handle Google Sign-up
router.post("/googleSignup", async (req, res) => {
  const { token } = req.body;
  const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });

  try {
    const googleEmail = userInfo.data.email;

    // Check if the user exists in your database by their Google Email
    const user = await User.findOne({ email: googleEmail });

    if (user) {
      if (user.isActive) {
        res.status(200).json({ status: false, user, message: "User already exist" });
      }
    } else {
      // User doesn't exist, create a new user in your database
      const newUser = new User({
        firstName: userInfo.data.given_name,
        lastName: userInfo.data.family_name,
        email: userInfo.data.email,
        password: "1",
        isGoogle: true,
      });

      await newUser.save();

      const access_token = jwt.sign({ user_id: user._id, email: userInfo.data.email }, TOKEN_KEY, {
        expiresIn: "8h",
      });
      res.status(200).json({ status: true, user: newUser, access_token });
    }
  } catch (error) {
    console.error("Error verifying Google token:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
