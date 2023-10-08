const mongoose = require("mongoose");

const { DATABASE_URL } = process.env;

const connectDB = () => {
  try {
    mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
    });
    console.log("mongoDB connected ...");
  } catch (err) {
    console.log(err.message);
    // Exit process in failure
    process.exit(1);
  }
};

module.exports = connectDB;
