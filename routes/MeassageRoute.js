const express = require("express");
const messageRouter = express.Router();

const Message = require("../schemas/MessageModel");

// Creating Meassage
messageRouter.post("/", async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new Message({
    chatId,
    senderId,
    text,
  });
  try {
    const result = await message.save();
    res.status(200).json({ status: true, result: result });
  } catch (error) {
    res.status(500).json({ status: false, messag: "Server Error" });
  }
});

messageRouter.post("/chatId", async (req, res) => {
  const { chatId } = req.body;
  try {
    const result = await Message.find({ chatId }).select("-updatedAt");
    res.status(200).json({ status: true, result: result });
  } catch (error) {
    res.status(500).json({ status: false, messag: "Server Error" });
  }
});

module.exports = messageRouter;
