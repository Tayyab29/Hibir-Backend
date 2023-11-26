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
      isPublished,
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
      isPublished,
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

// API endpoint to get Property details By Id
advertiseRouter.post("/getAdvertisement", async (req, res) => {
  try {
    const { userId, searchQuery, propertyType, isSaved } = req.body;

    if (!userId) {
      return res.status(400).json({ status: false, message: "User ID is required" });
    }

    // Construct the search conditions
    const searchConditions = {
      user: userId,
      isFullfilled: true,
    };

    // If a property type is specified, add it to the search conditions
    if (propertyType) {
      searchConditions.propertyType = { $regex: propertyType, $options: "i" };
    }
    if (isSaved) {
      searchConditions.isSaved = true;
    }

    // If there's a search query, add text search conditions for propertyName, rentTitle, and description
    if (searchQuery) {
      searchConditions.$or = [
        // { propertyNames: { $regex: searchQuery, $options: "i" } },
        { propertyAdress: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Find the Advertise documents based on the constructed search conditions
    const foundAds = await Advertise.find(searchConditions).select(
      "propertyAdress propertyBaths user _id description displayImage"
    );

    if (foundAds.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No record available",
      });
    }

    // Send found advertisements as the response
    return res.status(200).json({ status: true, properties: foundAds });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, message: "Error fetching advertisements" });
  }
});

// API endpoint to get Property details By Id
advertiseRouter.post("/getAllAdvertisement", async (req, res) => {
  try {
    const { userId, searchQuery, propertyType, isSaved, skip, take } = req.body;
    let skipRecords = skip || 0;
    let takeRecords = take || 4;

    // if (!userId) {
    //   return res.status(400).json({ status: false, message: "User ID is required" });
    // }

    // Construct the search conditions
    const searchConditions = {
      user: userId,
      isFullfilled: true,
    };

    // If a property type is specified, add it to the search conditions
    if (propertyType) {
      searchConditions.propertyType = { $regex: propertyType, $options: "i" };
    }
    if (isSaved) {
      searchConditions.isSaved = true;
    }

    // If there's a search query, add text search conditions for propertyName, rentTitle, and description
    if (searchQuery) {
      searchConditions.$or = [
        // { propertyNames: { $regex: searchQuery, $options: "i" } },
        { propertyAdress: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Find the Advertise documents based on the constructed search conditions
    const foundAds = await Advertise.find()
      .select("propertyAdress propertyBaths user _id description displayImage")
      .sort({ createdAt: -1 })
      .skip(skipRecords)
      .limit(takeRecords);

    if (foundAds.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No record available",
      });
    }

    // Send found advertisements as the response
    return res.status(200).json({ status: true, properties: foundAds });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ status: false, message: "Error fetching advertisements" });
  }
});

//  API endpoint to getAdvertisement By Id
advertiseRouter.post("/getAdvertiseById", async (req, res) => {
  try {
    const { id } = req.body;

    // For example, you can retrieve user details from MongoDB based on user._id
    const foundUser = await Advertise.findById(id).select("-updatedAt -displayImage");
    // Create an object to store counts for each index
    const indexCounts = {};
    if (foundUser.images?.length > 0) {
      // Count occurrences of each index
      foundUser.images.forEach((item) => {
        const { index } = item;
        indexCounts[index] = (indexCounts[index] || 0) + 1;
      });
    }

    if (!foundUser) {
      return res.status(404).json({ status: false, message: "Details not found" });
    }
    // Send user details as the response
    return res.status(200).json({ status: true, details: foundUser, totalImages: indexCounts });
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
    let displayImage = "";

    if (req.files && req.files.length > 0) {
      const mergedArray = [...req.files];
      if (found.images.length > 0) {
        const total = found.images.length - 1;
        displayImage = found.images[total];
        found.images.map((item) => {
          mergedArray.push({
            originalname: item.fileName,
            mimetype: item.fileType,
            buffer: item.data,
            position: item.index,
          });
        });
      } else {
        displayImage = {
          fileName: mergedArray[0].originalname,
          fileType: mergedArray[0].mimetype,
          data: mergedArray[0].buffer,
          index: mergedArray[0].position ?? index,
        };
      }

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
        displayImage: displayImage,
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
