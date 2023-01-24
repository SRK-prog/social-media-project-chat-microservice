const mongoose = require("mongoose");

const connectDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // Remove the Deprecation Warning
      mongoose.set("strictQuery", false);
      await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("DB connected");
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = connectDB;
