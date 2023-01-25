const router = require("express").Router();
const Message = require("../models/messageModel");

// add message

router.post("/", async (req, res) => {
  try {
    const result = await new Message(req.body).save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get message

router.get("/", async (req, res) => {
  const { skip, limit, conversationId } = req.query;
  try {
    const data = await Message.find({ conversationId })
      .skip(Number(skip * limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .exec();
    const totalDocuments = await Message.count({ conversationId });
    const total = Math.ceil(totalDocuments / limit);
    res.status(200).json({ data, total });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
