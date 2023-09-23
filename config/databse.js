const mongoose = require("mongoose");

const { DATABASE_URL } = process.env;

const db = `mongodb+srv://Khazain:ieXrH6p7vtY45jzQ@cluster0.tg71iks.mongodb.net/?retryWrites=true&w=majority`;

const connectDB = () => {
  try {
    mongoose.connect(db, {
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
