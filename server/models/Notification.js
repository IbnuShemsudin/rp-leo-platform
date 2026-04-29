const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: String,

    message: String,

    type: {
      type: String,
      default: "info",
    },

    role: {
      type: String,
      default: "admin",
    },

    read: {
      type: Boolean,
      default: false,
    },

    link: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);