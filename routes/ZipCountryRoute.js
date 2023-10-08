const express = require("express");
const zipRouter = express.Router();

const Zipcode = require("../schemas/ZipCodeModel");
const Country = require("../schemas/CountryModel");

// API endpoint to get user details by name (partial match)
zipRouter.get("/searchZipcode", async (req, res) => {
  try {
    const user = req.user;
    const { zip } = req.body;

    // Use a regular expression to find records with zip similar to the provided zip
    const foundUsers = await Zipcode.find({ zip: { $regex: zip, $options: "i" } }).limit(15);

    if (foundUsers.length === 0) {
      return res.status(404).json({ message: "No record found with a similar zip" });
    }

    // Send the list of similar users as the response
    res.status(200).json(foundUsers);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error fetching user details" });
  }
});

module.exports = zipRouter;
