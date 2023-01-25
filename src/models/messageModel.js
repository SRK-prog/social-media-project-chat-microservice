const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: String, required: true, default: "" },
    sender: { type: String, required: true, default: "" },
    text: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
