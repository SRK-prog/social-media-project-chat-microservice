const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 6 },
    profilepicture: { type: String, default: "" },
    followers: { type: Array, default: [] },
    followings: { type: Array, default: [] },
    isAdmin: { type: Boolean, default: false },
    desc: { type: String, default: "" },
    city: { type: String, default: "" },
    lastSeen: { type: Number, default: Date.now() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
