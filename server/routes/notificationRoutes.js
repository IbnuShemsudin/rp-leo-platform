const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

/*
GET notifications
*/
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch notifications",
    });
  }
});

/*
CREATE notification
*/
router.post("/", async (req, res) => {
  try {
    const { title, message, type, role, link } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type,
      role,
      link,
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create notification",
    });
  }
});

module.exports = router;