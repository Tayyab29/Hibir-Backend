const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    isRead: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notification", NotificationSchema);
module.exports = NotificationModel;
