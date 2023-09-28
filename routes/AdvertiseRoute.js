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
    // Validate user input
    // if (!(email && password && firstName)) {
    //   return res.status(400).send("All input is required");
    // }

    // encryptedPassword = bcrypt.hash(password, SECRET_KEY);

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

//edit User by id
// advertiseRouter.put("/edit-user", async (req, res) => {
//   try {
//     // Extract Dish information and ID from request body and URL
//     const {
//       _id,
//       isActive,
//       firstName,
//       lastName,
//       phoneNo,
//       addressMain,
//       address,
//       country,
//       state,
//       city,
//       zip,
//     } = req.body;

//     // Update Dish document in MongoDB
//     await User.findByIdAndUpdate(`${_id}`, {
//       isActive,
//       firstName,
//       lastName,
//       phoneNo,
//       addressMain,
//       address,
//       country,
//       state,
//       city,
//       zip,
//     });

//     // Send success response
//     res.status(200).send("User updated successfully");
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     res.status(500).send("Error updating User");
//   }
// });

module.exports = advertiseRouter;
