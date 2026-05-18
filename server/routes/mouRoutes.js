import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/*
=================================================
 CREATE MOUs (REGISTER)
=================================================
*/

router.post("/register", auth, async (req, res) => {
  try {
    console.log("🔥 Incoming MoU Body:", req.body);

    const data = req.body;

    const payload = {
      partnerName: data.partnerName,
      country: data.country,
      sector: data.sector,
      description: data.description,

      expected_duration: data.expectedDuration,
      partnership_type: data.partnershipType,
      priority_level: data.priorityLevel,

      contact_person: data.contactPerson,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,

      initial_document_url: data.initialDocumentUrl,

      status: data.status || "Draft",
      current_step: data.currentStep || 1,
      date_initiated: data.dateInitiated,

      created_by: req.user?.id || null,
    };

    console.log("🚀 Payload To Supabase:", payload);

    const { data: result, error } = await supabase
      .from("mous")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ SUPABASE INSERT ERROR:", error);

      return res.status(500).json({
        success: false,
        msg: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: "MoU Registered Successfully",
      data: result,
    });

  } catch (err) {
    console.error("💥 MOU REGISTER CRASH:", err);

    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});

/*
=================================================
 UPDATE MOUs (ADMIN / EXECUTIVE ONLY)
=================================================
*/

router.put("/update/:id", auth, async (req, res) => {
  try {
    if (!["admin", "executive"].includes(req.user.role)) {
      return res.status(403).json({
        msg: "Access Denied: Insufficient Permissions",
      });
    }

    const { status, currentStep } = req.body;

    const { data, error } = await supabase
      .from("mous")
      .update({
        status,
        current_step: currentStep,
        last_modified_by: req.user.id,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error("❌ UPDATE ERROR:", error);

      return res.status(404).json({
        msg: error.message || "MoU not found",
      });
    }

    return res.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("💥 UPDATE CRASH:", err);

    return res.status(500).json({
      message: "Error updating registry entry",
      error: err.message,
    });
  }
});

/*
=================================================
 SIGN MOUs (EXECUTIVE / ADMIN ONLY)
=================================================
*/

router.patch("/sign/:id", auth, async (req, res) => {
  try {
    if (
      req.user.role !== "executive" &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        msg: "Unauthorized: Only Executives can sign MoUs",
      });
    }

    const { data, error } = await supabase
      .from("mous")
      .update({
        status: "Active",
        current_step: 7,
        signing_date: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error("❌ SIGN ERROR:", error);

      return res.status(500).json({
        message: "Error during signing phase",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      data,
    });

  } catch (err) {
    console.error("💥 SIGN CRASH:", err);

    return res.status(500).json({
      message: "Error during signing phase",
      error: err.message,
    });
  }
});

/*
=================================================
 GET ALL MOUs
=================================================
*/

router.get("/all", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("mous")
      .select("*")
      .order("updated_at", {
        ascending: false,
      });

    if (error) {
      console.error("❌ FETCH ERROR:", error);

      return res.status(500).json({
        message: "Error fetching registry",
        error: error.message,
      });
    }

    return res.json(data);

  } catch (err) {
    console.error("💥 FETCH CRASH:", err);

    return res.status(500).json({
      message: "Error fetching registry",
      error: err.message,
    });
  }
});

/*
=================================================
 DELETE MOU (ADMIN ONLY)
=================================================
*/

router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        msg: "Only System Admins can delete records",
      });
    }

    const { error } = await supabase
      .from("mous")
      .delete()
      .eq("id", req.params.id);

    if (error) {
      console.error("❌ DELETE ERROR:", error);

      return res.status(500).json({
        message: "Delete operation failed",
        error: error.message,
      });
    }

    return res.json({
      success: true,
      msg: "MoU successfully removed from registry",
    });

  } catch (err) {
    console.error("💥 DELETE CRASH:", err);

    return res.status(500).json({
      message: "Delete operation failed",
      error: err.message,
    });
  }
});

export default router;