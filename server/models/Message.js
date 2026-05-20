import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    mouId: {
      type: String,
      required: true,
    },

    sender: {
      type: String,
      default: "Unknown",
    },

    senderRole: {
      type: String,
      default: "partner",
    },

    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);