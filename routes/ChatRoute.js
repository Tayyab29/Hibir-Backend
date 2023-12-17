const express = require("express");
const chatRouter = express.Router();

const Chat = require("../schemas/ChatModel");

// Creating Chat
// chatRouter.post("/", async (req, res) => {
//   const newChat = new Chat({
//     users: [req.body.senderId, req.body.receiverId],
//   });
//   try {
//     const result = await newChat.save();
//     res.status(200).json(result);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
chatRouter.post("/", async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    // Check if a chat already exists for the given pair of users
    const existingChat = await Chat.findOne({
      users: { $all: [senderId, receiverId] },
    });
    if (existingChat) {
      // If a chat exists, return the existing chat details
      return res.status(200).json({ status: true, existingChat });
    }
    // If a chat doesn't exist, create a new one
    const newChat = new Chat({
      users: [senderId, receiverId],
    });

    const result = await newChat.save();
    res.status(200).json({ status: true, result });
  } catch (error) {
    res.status(500).json({ status: false, error });
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
