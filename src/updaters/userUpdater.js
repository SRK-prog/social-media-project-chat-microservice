const User = require("../models/userModel");

class UserUpdater {
  static async updateLastSeen(userId) {
    try {
      await User.findByIdAndUpdate(userId, { $set: { lastSeen: Date.now() } });
    } catch (error) {
      console.log("fail to update last seen: updateLastSeen \n", error);
    }
  }
}

module.exports = UserUpdater;
