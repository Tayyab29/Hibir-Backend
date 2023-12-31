const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: false },
    fileType: { type: String, required: false },
    data: { type: Buffer, required: false },
    index: { type: Number, required: false },
  },
  {
    _id: false, // Don't create a separate _id for images
  }
);

const advertiseSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    isPackage: { type: String, required: true },
    propertyUnit: { type: String, required: true }, //done
    propertyAdress: { type: String, required: false }, //done
    propertyType: { type: String, required: true },
    propertyNames: { type: [String], required: false },
    propertyBeds: { type: [String], required: false },
    propertyBaths: { type: [String], required: false },
    sizeSqft: { type: [Number], required: false },
    rent: { type: [Number], required: false },
    deposit: { type: [String], required: false },
    leaseLength: { type: [String], required: false },
    availableDate: { type: [Date], default: Date.now, required: false },
    images: [imageSchema], // Use the imageSchema for images
    displayImage: {
      fileName: { type: String, required: false },
      fileType: { type: String, required: false },
      data: { type: Buffer, required: false },
      index: { type: Number, required: false },
    },
    description: { type: String, required: false },
    rentTitle: { type: String, required: false },
    rentStartDate: { type: Date, default: Date.now, required: false },
    rentEndDate: { type: Date, default: Date.now, required: false },
    rentDescription: { type: String, required: false },
    utilities: [{ type: String }],
    petsAllowed: { type: String, required: false },
    laundryType: { type: String, required: false },
    parkingType: { type: String, required: false },
    amenities: [{ type: String }],
    userType: { type: String, required: false },
    contactPreference: { type: String, required: false },
    isHideName: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
    isFullfilled: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const AdvertiseModel = mongoose.model("Advertise", advertiseSchema);

module.exports = AdvertiseModel;
