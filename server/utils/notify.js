import { supabase } from "../config/supabase.js";

export const sendNotification = async ({ title, message, type = "mou", role = null, userId = null, link = "#" }) => {
  try {
    if (!userId) {
      console.warn("⚠️ sendNotification called with no userId — skipping");
      return { success: false, data: null };
    }

    const payload = {
      title,
      message,
      type,
      role,
      user_id: userId,
      link,
      read: false,
      created_at: new Date().toISOString(),
    };

    console.log("🔔 Sending notification to user:", userId, "| title:", title);

    const { data, error } = await supabase
      .from("notifications")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ Notification insert error:", error.message, error);
      throw new Error(`Notification insert failed: ${error.message}`);
    }

    console.log("✅ Notification created:", data.id);
    return { success: true, data };
  } catch (err) {
    console.error("💥 Notification helper crash:", err.message);
    throw err;
  }
};