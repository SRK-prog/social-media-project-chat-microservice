const mongoose = require("mongoose");

const ConnectDB = () => {
  return new Promise(async (resolve, reject) => {
    try {
      mongoose.set("strictQuery", false);
      mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("DB connected");
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = ConnectDB;
