import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";

const router = express.Router();


// ======================================================
// GET ALL MESSAGES FOR SPECIFIC MOU
// ======================================================
router.get("/:mouId", auth, async (req, res) => {
  try {
    const { mouId } = req.params;

    console.log("=================================");
    console.log("FETCHING MESSAGES");
    console.log("MOU ID:", mouId);
    console.log("USER:", req.user);
    console.log("=================================");

    // ==========================================
    // CHECK IF MOU EXISTS
    // ==========================================
    const { data: mou, error: mouError } = await supabase
      .from("mous")
      .select("*")
      .eq("id", mouId)
      .single();

    if (mouError || !mou) {
      console.log("MOU NOT FOUND:", mouError);

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
      console.log("SUPABASE FETCH ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("MESSAGES FOUND:", data?.length || 0);

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

    console.log("=================================");
    console.log("NEW MESSAGE");
    console.log("BODY:", req.body);
    console.log("USER:", req.user);
    console.log("=================================");

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
    const messagePayload = {
      mou_id: mouId,

      sender:
        req.user?.name ||
        req.user?.email ||
        "Unknown User",

      sender_role:
        req.user?.role || "partner",

      text: text.trim(),

      created_at: new Date().toISOString(),
    };

    console.log("INSERTING:", messagePayload);

    const { data, error } = await supabase
      .from("messages")
      .insert([messagePayload])
      .select();

    if (error) {
      console.log("SUPABASE INSERT ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("MESSAGE SENT SUCCESSFULLY");

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