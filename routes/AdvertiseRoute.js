const express = require("express");
const advertiseRouter = express.Router();
const multer = require("multer");

const Advertise = require("../schemas/AdvertiseModel");

// Set up multer to handle file uploads
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage: storage });

// Creation
advertiseRouter.post("/create", async (req, res) => {
  try {
    const {
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyNames,
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
      utilities,
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
      propertyNames,
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
      utilities,
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
      propertyNames,
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
      utilities,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      isSaved: true,
      isFullfilled: false,
      user,
      isActive: true,
    });
    const result = await advertise.save();
    res
      .status(200)
      .send({ status: true, message: "Advertisement Created Succesfully", advertise: result?._id });
  } catch (err) {
    res.status(500).send({ status: false, message: "Server Error" });
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
      propertyNames,
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
      utilities,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      isSaved,
      isFullfilled,
      user,
    } = req.body;
    // Update Dish document in MongoDB
    await Advertise.findByIdAndUpdate(`${_id}`, {
      isPackage,
      propertyUnit,
      propertyAdress,
      propertyType,
      propertyNames,
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
      utilities,
      petsAllowed,
      laundryType,
      parkingType,
      amenities,
      userType,
      contactPreference,
      isHideName,
      isSaved,
      isFullfilled,
      user,
      isActive: true,
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

// For Uploading Files
advertiseRouter.post("/upload", upload.array("attachments"), async (req, res) => {
  try {
    const { _id, index } = req.body;
    const found = await Advertise.findById(_id).select("images");

    if (req.files && req.files.length > 0) {
      const mergedArray = [...req.files];
      if (found.images.length > 0) {
        found.images.map((item) => {
          mergedArray.push({
            originalname: item.fileName,
            mimetype: item.fileType,
            buffer: item.data,
            position: item.index,
          });
        });
      }
      // const user_files = req.files;
      // const mergedArray = user_files.map((item1) => {
      //   console.log({ user_files: item1 });
      //   const matchingItem = found.images.find(
      //     (item2) => item2.index == index && item1.originalname === item2.fileName
      //   );
      //   return matchingItem
      //     ? {
      //         originalname: matchingItem.fileName,
      //         mimetype: matchingItem.fileType,
      //         buffer: matchingItem.data,
      //       }
      //     : item1;
      //   // } else {
      //   //   return item1;
      //   // }
      // });
      const attachments = [];

      for (const file of mergedArray) {
        const { originalname, mimetype, buffer, position } = file;
        const attachment = {
          fileName: originalname,
          fileType: mimetype,
          data: buffer,
          index: position ?? index,
        };

        attachments.push(attachment);
      }
      // Upload document in MongoDB
      await Advertise.findByIdAndUpdate(`${_id}`, {
        images: attachments,
      });

      const matchingArray = attachments
        .filter((item) => item.index == index)
        .map((item) => ({ fileName: item.fileName, fileType: item.fileType }));

      res
        .status(200)
        .json({ status: true, message: "File uplaoded successfully", upload: matchingArray });
    } else {
      res.status(200).json({ status: false, message: "No files provided for upload." });
    }
  } catch (error) {
    res.status(500).send({ status: false, message: "Server Error." });
  }
});

module.exports = advertiseRouter;
