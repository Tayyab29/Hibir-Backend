const mongoose = require("mongoose");

const zipSchema = new mongoose.Schema({
  zip: { type: String, required: false },
  city: { type: String, required: false },
  state_name: { type: String, required: false },
});

const ZipModel = mongoose.model("Zipcode", zipSchema);

module.exports = ZipModel;
