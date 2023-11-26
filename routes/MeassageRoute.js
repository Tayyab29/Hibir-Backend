const express = require("express");
const messageRouter = express.Router();

const Message = require("../schemas/MessageModel");
const Notification = require("../schemas/NotificationModel");

// Creating Meassage
messageRouter.post("/", async (req, res) => {
  const { chatId, senderId, text, recieverId } = req.body;
  const message = new Message({
    chatId,
    senderId,
    text,
  });
  const notify = new Notification({
    userId: recieverId,
    senderId: senderId,
    chatId: chatId,
    isRead: false,
  });

  try {
    const _message = message.save();
    const notifi = notify.save();

    const [msg, noti] = await Promise.all([_message, notifi]);

    res.status(200).json({ status: true, result: msg });
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
