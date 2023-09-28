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
      return res.status(400).send("All input is required");
    }
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(200).send("User already exist");
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
      res.status(200).send("User Created Succesfully");
    }
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user) {
      check = await bcrypt.compare(password, user.password);

      if (check) {
        // Create token
        const access_token = jwt.sign({ user_id: user._id, email }, TOKEN_KEY, {
          expiresIn: "8h",
        });

        res.status(200).json({ status: true, user, access_token });
        return;
      }
      res.status(200).send({ status: false, message: "Invalid email or password" });
    }
    res.status(200).send({ status: false, message: "Invalid email or password" });
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

//User ResetPassword Api
userRouter.post("/resetpassword", async (req, res) => {
  const { token, password } = req.body;
  try {
    // Verify and decode the JWT token
    const decoded = jwt.verify(token, TOKEN_KEY);

    const email = decoded;

    // Check if the password is exist
    if (!password) {
      return res.status(400).send("Password is required");
    }
    newencryptedPassword = await bcrypt.hash(password, 10);
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      //find user and update one
      await User.findByIdAndUpdate(oldUser._id, { password: newencryptedPassword });

      //return updated User
      const updated_user = await User.findOne({ email });
      res.status(200).send(updated_user);
    }
    res.status(400).send("Failed to reset password");
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
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
      addressMain,
      address,
      country,
      state,
      city,
      zip,
    } = req.body;

    // Update Dish document in MongoDB
    await User.findByIdAndUpdate(`${_id}`, {
      isActive,
      firstName,
      lastName,
      phoneNo,
      addressMain,
      address,
      country,
      state,
      city,
      zip,
    });

    // Send success response
    res.status(200).send("User updated successfully");
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Error updating User");
  }
});

//  API endpoint to get user details
userRouter.get("/get-user-details", verifyToken, async (req, res) => {
  try {
    const user = req.user;

    console.log({ user });
    // For example, you can retrieve user details from MongoDB based on user._id
    const foundUser = await User.findById(user._id);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send user details as the response
    res.status(200).json(foundUser);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error fetching user details" });
  }
});
//  API endpoint to get user details By Id
userRouter.post("/get-user-id", async (req, res) => {
  try {
    const { id } = req.body;

    // For example, you can retrieve user details from MongoDB based on user._id
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Send user details as the response
    res.status(200).json(foundUser);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error fetching user details" });
  }
});

module.exports = userRouter;
