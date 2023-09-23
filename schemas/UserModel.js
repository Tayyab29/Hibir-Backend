const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    email: { type: String, reuired: true, unique: true },
    password: { type: String, required: true }, //done
    firstName: { type: String, required: true }, //done
    lastName: { type: String, required: true },
    phoneNo: { type: String, required: false },
    addressMain: { type: String, required: false },
    address: { type: String, required: false },
    country: { type: String, required: false },
    state: { type: String, required: false },
    city: { type: String, required: false },
    zip: { type: String, required: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
