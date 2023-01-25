const router = require("express").Router();
const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const Utils = require("../utils/utils");

// get conversation of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    const ids = conversations.map((conv) => conv._id.toString());
    const messages = await Message.aggregate([
      { $match: { conversationId: { $in: ids } } },
      { $sort: { createdAt: -1 } },
      {
        $group: { _id: "$conversationId", doc: { $first: "$$ROOT" } },
      },
      { $sort: { "doc.createdAt": -1 } },
    ]);

    const result = Utils.mergeConversations(conversations, messages);

    res.status(200).json(result);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).json(err);
  }
});

// get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
