const express = require("express");
const userRouter = express.Router();

const User = require("../schemas/UserModel");
const { TOKEN_KEY } = process.env;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/auth");

// Sign up
userRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // Validate user input
    if (!(email && password && firstName)) {
      return res.status(200).send({ status: false, message: "All input is required" });
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(200).send({ status: false, message: "User already exist" });
    } else {
      // encryptedPassword = bcrypt.hash(password, SECRET_KEY);
      const hashedPassword = bcrypt.hashSync(password, 10);
      const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isActive: true,
      });
      await user.save();
      return res.status(200).send({ status: true, message: "User Created Succesfully" });
    }
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error" });
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send({ status: false, message: "All input is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      if (user.isGoogle) {
        // Create token
        const access_token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
          expiresIn: "8h",
        });
        res.status(200).send({ status: true, message: "login successfully", user, access_token });
        return;
      } else {
        check = await bcrypt.compare(password, user.password);

        if (check) {
          // Create token
          const access_token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
            expiresIn: "8h",
          });
          res.status(200).send({ status: true, message: "login successfully", user, access_token });
          return;
        }
      }
      res.status(200).send({ status: false, message: "Invalid email or password" });
      return;
    }
    res.status(200).send({ status: false, message: "Invalid email or password" });
  } catch (err) {
    return res.status(500).send({ status: false, message: "Server Error creating user" });
  }
});

//User ResetPassword Api
userRouter.post("/resetpassword", async (req, res) => {
  try {
    const { email, password } = req.body;
    // // Verify and decode the JWT token
    // const decoded = jwt.verify(token, TOKEN_KEY);

    // const email = decoded;

    // Check if the password is exist
    if (!password) {
      return res.status(400).send({ status: false, message: "Password is required" });
    }
    newencryptedPassword = await bcrypt.hash(password, 10);
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      //find user and update one
      await User.findByIdAndUpdate(oldUser._id, { password: newencryptedPassword });

      res.status(200).json({ status: true, message: "Password got reset successfully" });
      return;
    }
    res.status(400).json({ status: false, message: "Failed to reset password" });
  } catch (err) {
    return res.status(500).send({ status: false, message: "Server Error creating user" });
  }
});

//edit User by id
userRouter.put("/edit-user", async (req, res) => {
  try {
    // Extract Dish information and ID from request body and URL
    const {
      _id,
      isActive,
      firstName,
      lastName,
      phoneNo,
      email,
      password,
      addressMain,
      address,
      country,
      state,
      city,
      zip,
      language,
    } = req.body;

    if (password) {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const resp = await User.findByIdAndUpdate(
        _id,
        {
          password: hashedPassword,
        },
        { new: true }
      ).select("-password");
      res
        .status(200)
        .send({ status: true, message: "User password updated successfully", user: resp });
      return;
    } else {
      const oldUser = await User.findOne({ email });
      if (oldUser) {
        res.status(200).send({ status: false, meassge: "email already exist" });
        return;
      }

      const resp = await User.findByIdAndUpdate(
        _id,
        {
          isActive,
          firstName,
          lastName,
          phoneNo,
          addressMain,
          email,
          password,
          address,
          country,
          state,
          city,
          zip,
          language,
        },
        { new: true }
      ).select("-password");

      // Send success response
      return res
        .status(200)
        .send({ status: true, message: "User updated successfully", user: resp });
    }
  } catch (error) {
    // Handle errors
    return res.status(500).send("Error updating User");
  }
});

//  API endpoint to get user details
userRouter.get("/get-user-details", verifyToken, async (req, res) => {
  try {
    const user = req.user;

    // For example, you can retrieve user details from MongoDB based on user._id
    const foundUser = await User.findById(user.user_id);

    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    // Send user details as the response
    res.status(200).json(foundUser);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, message: "Error fetching user details" });
  }
});
//  API endpoint to get user details By Id
userRouter.post("/get-user-id", async (req, res) => {
  try {
    const { id } = req.body;

    // For example, you can retrieve user details from MongoDB based on user._id
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    // Send user details as the response
    return res.status(200).json(foundUser);
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, message: "Error fetching user details" });
  }
});

//  API endpoint to get user By Email
userRouter.post("/getByEmail", async (req, res) => {
  try {
    const { email } = req.body;

    // For example, you can retrieve user details from MongoDB based on user._id
    const foundUser = await User.findOne({ email }).select("-password");

    if (!foundUser) {
      return res.status(200).json({ status: false, message: "User not found" });
    }
    // Send user details as the response
    res.status(200).json({ status: true, user: foundUser });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, message: "Error fetching user details" });
  }
});

module.exports = userRouter;
