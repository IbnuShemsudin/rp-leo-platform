import { supabase as defaultSupabase } from "../config/supabase.js";
import { sendNotification as defaultSendNotification } from "./notify.js";
import { sendEmailNotification as defaultSendEmailNotification } from "./email.js";

/**
 * Create a notification helper with injectable dependencies.
 * This allows unit testing without module-level mocking.
 */
export const createNotifyHelpers = ({
  supabaseClient = defaultSupabase,
  sendNotif = defaultSendNotification,
  sendEmail = defaultSendEmailNotification,
} = {}) => {
  /**
   * Fetch all users with role "admin".
   * Returns an array of { id, name, email } objects.
   * Filters out users with missing or invalid email addresses.
   */
  const getAdminUsers = async () => {
    const { data, error } = await supabaseClient
      .from("users")
      .select("id, name, email")
      .eq("role", "admin");

    if (error) {
      console.error("⚠️ Failed to fetch admin users:", error.message);
      return [];
    }

    return (data || []).filter(
      (u) => u.email && typeof u.email === "string" && u.email.includes("@")
    );
  };

  /**
   * Send in-app notification to all admin users, skipping the creator
   * to avoid duplicate notifications when the creator is also an admin.
   */
  const notifyAdminsInApp = async ({ title, message, link, skipUserId = null }) => {
    const admins = await getAdminUsers();

    if (admins.length === 0) {
      console.warn("⚠️ No admin users found for in-app notification");
      return;
    }

    const results = await Promise.allSettled(
      admins
        .filter((admin) => admin.id !== skipUserId)
        .map((admin) =>
          sendNotif({
            title,
            message,
            type: "mou",
            userId: admin.id,
            link,
          })
        )
    );

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error(
        `⚠️ ${failures.length}/${results.length} in-app notifications failed:`,
        failures.map((f) => f.reason?.message || f.reason)
      );
    }
  };

  /**
   * Send email notification to all admin users.
   */
  const notifyAdminsEmail = async ({ subject, htmlContent, skipUserId = null }) => {
    const admins = await getAdminUsers();

    if (admins.length === 0) {
      console.warn("⚠️ No admin users found for email notification");
      return;
    }

    const recipients = admins.filter((admin) => admin.id !== skipUserId);

    if (recipients.length === 0) {
      console.warn("⚠️ All admin users are the creator — no emails to send");
      return;
    }

    const results = await Promise.allSettled(
      recipients.map((admin) =>
        sendEmail({
          to: admin.email,
          subject,
          htmlContent,
        })
      )
    );

    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error(
        `⚠️ ${failures.length}/${results.length} admin emails failed:`,
        failures.map((f) => f.reason?.message || f.reason)
      );
    }
  };

  return { getAdminUsers, notifyAdminsInApp, notifyAdminsEmail };
};

// Default singleton for production use (no injection needed)
const defaults = createNotifyHelpers();
export const getAdminUsers = defaults.getAdminUsers;
export const notifyAdminsInApp = defaults.notifyAdminsInApp;
export const notifyAdminsEmail = defaults.notifyAdminsEmail;
