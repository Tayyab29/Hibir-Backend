const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema({
  name: { type: String, required: false },
});

// const CountryModel = mongoose.model("Country", countrySchema);
const CountryModel = mongoose.model("Country", countrySchema, "countrys");

module.exports = CountryModel;
