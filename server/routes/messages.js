import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";
import { sendNotification } from "../utils/notify.js";
import { notifyAdminsInApp } from "../utils/notifyAdmins.js";

const router = express.Router();


// ======================================================
// GET ALL MESSAGES FOR SPECIFIC MOU
// ======================================================
router.get("/:mouId", auth, async (req, res) => {
  try {
    const { mouId } = req.params;

    // ==========================================
    // CHECK IF MOU EXISTS
    // ==========================================
    const { data: mou, error: mouError } = await supabase
      .from("mous")
      .select("*")
      .eq("id", mouId)
      .single();

    if (mouError || !mou) {
      return res.status(404).json({
        success: false,
        message: "MoU not found",
      });
    }

    // ==========================================
    // SECURITY CHECK
    // ==========================================
    // Admin & executive can access everything
    const isAdmin =
      req.user?.role === "admin" ||
      req.user?.role === "executive";

    // Partner can only access own MOU
    const isOwner =
      mou.contact_email === req.user?.email ||
      mou.created_by === req.user?.id;

    if (!isAdmin && !isOwner) {
      console.log("ACCESS DENIED");

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ==========================================
    // FETCH MESSAGES
    // ==========================================
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("mou_id", mouId)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      messages: data || [],
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ======================================================
// SEND MESSAGE
// ======================================================
router.post("/", auth, async (req, res) => {
  try {
    const {
      mouId,
      text,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!mouId || !text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "mouId and text are required",
      });
    }

    // ==========================================
    // CHECK MOU
    // ==========================================
    const { data: mou, error: mouError } = await supabase
      .from("mous")
      .select("*")
      .eq("id", mouId)
      .single();

    if (mouError || !mou) {
      return res.status(404).json({
        success: false,
        message: "MoU not found",
      });
    }

    // ==========================================
    // ACCESS VALIDATION
    // ==========================================
    const isAdmin =
      req.user?.role === "admin" ||
      req.user?.role === "executive";

    const isOwner =
      mou.contact_email === req.user?.email ||
      mou.created_by === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "You cannot send messages here",
      });
    }

    // ==========================================
    // CREATE MESSAGE
    // ==========================================
    const senderRole = req.user?.role || "partner";

    const displaySender = req.user?.name || req.user?.email ;

    const messagePayload = {
      mou_id: mouId,

      sender: displaySender,

      sender_role: senderRole,

      text: text.trim(),

      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("messages")
      .insert([messagePayload])
      .select();

    if (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    // ==========================================
    // IN-APP NOTIFICATIONS
    // ==========================================
    const messagePreview = text.trim().length > 80
      ? text.trim().substring(0, 80) + "..."
      : text.trim();

    if (isAdmin) {
      // Admin/exec sent → notify the partner who owns this MoU
      // Try contact_email first, then fall back to created_by
      let partnerUserId = null;

      if (mou.contact_email) {
        try {
          const { data: partnerUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", mou.contact_email)
            .maybeSingle();
          partnerUserId = partnerUser?.id || null;
        } catch (lookupErr) {
          console.error("⚠️ Partner lookup by email failed:", lookupErr.message);
        }
      }

      // Fallback: if email lookup failed, try created_by (partner may have created the MoU themselves)
      if (!partnerUserId && mou.created_by && mou.created_by !== req.user.id) {
        partnerUserId = mou.created_by;
      }

      if (partnerUserId && partnerUserId !== req.user.id) {
        try {
          await sendNotification({
            title: "New message received",
            message: `${displaySender} sent you a new message about ${mou.partnerName}.`,
            type: "message",
            userId: partnerUserId,
            link: `/messages/${mouId}`,
          });
        } catch (notifErr) {
          console.error("⚠️ Partner notification failed:", notifErr);
        }
      }
    } else {
      // Partner/staff sent → notify all admins (skip sender)
      try {
        await notifyAdminsInApp({
          title: "New message received",
          message: `${displaySender} sent a new message about ${mou.partnerName}: "${messagePreview}"`,
          link: `/messages/${mouId}`,
          skipUserId: req.user?.id || null,
        });
      } catch (notifErr) {
        console.error("⚠️ Admin notification failed:", notifErr);
      }
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data,
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});


// ======================================================
// MARK CONVERSATION AS READ
// ======================================================
router.post("/:mouId/read", auth, async (req, res) => {
  try {
    const { mouId } = req.params;
    if (!mouId) {
      return res.status(400).json({
        success: false,
        message: "mouId is required",
      });
    }

    // Verify access (same rules as GET)
    const { data: mou, error: mouError } = await supabase
      .from("mous")
      .select("id, contact_email, created_by")
      .eq("id", mouId)
      .maybeSingle();

    if (mouError || !mou) {
      return res.status(404).json({
        success: false,
        message: "MoU not found",
      });
    }

    const isAdmin =
      req.user?.role === "admin" || req.user?.role === "executive";
    const isOwner =
      mou.contact_email === req.user?.email ||
      mou.created_by === req.user?.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from("messages")
      .update({ read_at: now })
      .eq("mou_id", mouId)
      .is("read_at", null);

    if (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({ success: true, read_at: now });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: err.message });
  }
});


// ======================================================
// GET PARTNER INBOX
// ======================================================
router.get("/partner/inbox/all", auth, async (req, res) => {
  try {
    console.log("FETCHING PARTNER INBOX");

    const isAdmin =
      req.user?.role === "admin" ||
      req.user?.role === "executive";

    let query = supabase
      .from("mous")
      .select("*")
      .order("created_at", { ascending: false });

    // PARTNER ONLY SEES OWN REQUESTS
    if (!isAdmin) {
      query = query.or(
        `contact_email.eq.${req.user?.email},created_by.eq.${req.user?.id}`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.log("INBOX ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    res.status(200).json({
      success: true,
      inbox: data || [],
    });

  } catch (err) {
    console.log("SERVER ERROR:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;