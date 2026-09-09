import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// GET /api/notifications
// Returns notifications belonging to the authenticated user
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("🔍 GET /notifications | userId:", userId);

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", String(userId))
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Notifications fetch error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("📬 Returning", data?.length || 0, "notifications for user", userId);
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

    console.log("🔍 PATCH /notifications/:id/read | id:", id, "| userId:", userId, "| types:", typeof id, typeof userId);

    const { data, error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", String(id))
      .eq("user_id", String(userId))
      .select();

    console.log("📝 Supabase update result | data:", data, "| error:", error);

    if (error) {
      console.error("❌ Mark notification read error:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    if (!data || data.length === 0) {
      console.warn("⚠️ No rows updated for notification", id, "user", userId);
      return res.status(404).json({
        success: false,
        message: "Notification not found or not owned by user",
      });
    }

    return res.json({
      success: true,
      data: data[0],
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