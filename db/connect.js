const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URI;

const connectDB = (url) => {
  return mongoose
    .connect(connectionString)
    .then(() => {
      console.log("CONNECTED TO THE DB...");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;