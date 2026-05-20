import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Step 1: get last message per mou_id
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("INBOX ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    // Step 2: group by mou_id
    const grouped = {};

    data.forEach((msg) => {
      if (!grouped[msg.mou_id]) {
        grouped[msg.mou_id] = {
          mouId: msg.mou_id,
          lastMessage: msg,
        };
      }
    });

    // Step 3: convert to array
    const inbox = Object.values(grouped);

    res.json(inbox);
  } catch (err) {
    console.error("INBOX SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;