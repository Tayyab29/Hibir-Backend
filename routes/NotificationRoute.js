const express = require("express");
const notificationRouter = express.Router();

const Notification = require("../schemas/NotificationModel");

// Creating Meassage
notificationRouter.post("/", async (req, res) => {
  const { userId, senderId } = req.body;
  const notify = new Notification({
    userId,
    senderId,
    isRead: false,
  });
  try {
    const result = await notify.save();
    res.status(200).json({ status: true, result: result });
  } catch (error) {
    res.status(500).json({ status: false, messag: "Server Error" });
  }
});

notificationRouter.post("/id", async (req, res) => {
  const { id } = req.body;
  try {
    const result = await Notification.find({ userId: id, isRead: false })
      .populate("senderId", "firstName lastName _id") // Populate senderId with firstname and lastname
      .select("-updatedAt");
    res.status(200).json({ status: true, result: result });
  } catch (error) {
    res.status(500).json({ status: false, messag: "Server Error" });
  }
});

notificationRouter.post("/notification-count", async (req, res) => {
  const { id } = req.body;
  try {
    // Fetch the count of unread notifications for the specified user
    const count = await Notification.countDocuments({ userId: id, isRead: false });

    res.status(200).json({ status: true, count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

// Update isRead status for notifications based on user ID
notificationRouter.post("/mark-as-read", async (req, res) => {
  const { userId } = req.body;
  try {
    // Find and update notifications for the specified user
    await Notification.updateMany({ senderId: userId }, { $set: { isRead: true } });

    res.status(200).json({ status: true, message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error" });
  }
});

module.exports = notificationRouter;
