const express = require("express");
const advertiseRouter = express.Router();

const Advertise = require("../schemas/AdvertiseModel");

// Creation
advertiseRouter.post("/create", async (req, res) => {
  try {
    const {
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyBeds,
      propertyBaths,
      sizeSqft,
      rent,
      deposit,
      leaseLength,
      availableDate,
      images,
      description,
      rentTitle,
      rentStartDate,
      rentEndDate,
      rentDescription,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      user,
    } = req.body;

    console.log({
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyBeds,
      propertyBaths,
      sizeSqft,
      rent,
      deposit,
      leaseLength,
      availableDate,
      images,
      description,
      rentTitle,
      rentStartDate,
      rentEndDate,
      rentDescription,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      user,
    });

    const advertise = await Advertise.create({
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyBeds,
      propertyBaths,
      sizeSqft,
      rent,
      deposit,
      leaseLength,
      availableDate,
      images,
      description,
      rentTitle,
      rentStartDate,
      rentEndDate,
      rentDescription,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      user,
      isActive: true,
    });
    await advertise.save();
    res.status(200).send("Advertisement Created Succesfully");
  } catch (err) {
    res.status(500).send(JSON.stringify(err));
  }
});

// Update Property by id
advertiseRouter.put("/editAdvertise", async (req, res) => {
  try {
    // Extract Dish information and ID from request body and URL
    const {
      _id,
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyBeds,
      propertyBaths,
      sizeSqft,
      rent,
      deposit,
      leaseLength,
      availableDate,
      images,
      description,
      rentTitle,
      rentStartDate,
      rentEndDate,
      rentDescription,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      user,
    } = req.body;
    // Update Dish document in MongoDB
    await Advertise.findByIdAndUpdate(`${_id}`, {
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyBeds,
      propertyBaths,
      sizeSqft,
      rent,
      deposit,
      leaseLength,
      availableDate,
      images,
      description,
      rentTitle,
      rentStartDate,
      rentEndDate,
      rentDescription,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      user,
      isActive,
    });

    // Send success response
    res.status(200).send({ status: true, message: "User updated successfully" });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send({ status: false, message: "Error updating User" });
  }
});

//  API endpoint to get Property details By Id
advertiseRouter.get("/getAdvertiseById", async (req, res) => {
  try {
    const { id } = req.body;

    // For example, you can retrieve user details from MongoDB based on user._id
    const found = await User.findById(id);

    if (!found) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    // Send user details as the response
    return res.status(200).json({ status: false, property: found });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, message: "Error fetching user details" });
  }
});

module.exports = advertiseRouter;
