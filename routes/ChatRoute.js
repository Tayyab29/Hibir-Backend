const express = require("express");
const chatRouter = express.Router();

const Chat = require("../schemas/ChatModel");

// Creating Chat
chatRouter.post("/", async (req, res) => {
  const newChat = new Chat({
    users: [req.body.senderId, req.body.receiverId],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Fetchig All Chat agnaist User
chatRouter.post("/getUserChatById", async (req, res) => {
  try {
    const chat = await Chat.find({
      users: { $in: [req.body.userId] },
    }).populate("users", "firstName lastName _id");
    res.status(200).json({ status: true, chat: chat });
  } catch (error) {
    res.status(500).json({ status: false, messag: "Server Error" });
  }
});

// Fetching Single Chat btw Two User
chatRouter.post("/find/:firstId/:secondId", async (req, res) => {
  try {
    const chat = await Chat.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json({ status: true, chat: chat });
  } catch (error) {
    res.status(500).json({ status: false, messag: "Server Error" });
  }
});

module.exports = chatRouter;
