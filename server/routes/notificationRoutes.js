import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/notifications
// Returns notifications belonging to the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Notifications fetch error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json(data || []);
  } catch (err) {
    console.error("💥 Notifications crash:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// PATCH /api/notifications/:id/read
// Marks a notification as read
router.patch("/:id/read", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("❌ Mark notification read error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      data,
    });
  } catch (err) {
    console.error("💥 Mark notification read crash:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;