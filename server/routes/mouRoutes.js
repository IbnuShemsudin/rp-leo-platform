import express from "express";
import { supabase } from "../config/supabase.js";
import auth from "../middleware/auth.js";
import { sendNotification } from "../utils/notify.js";
import { sendEmailNotification } from "../utils/email.js";
import {
  logAction,
  contextFromReq,
  PayloadBuilders,
} from "../utils/audit.js";
import {
  getMouSubmittedTemplate,
  getMouStatusTemplate,
  getMouSignedTemplate,
} from "../utils/emailTemplates.js";
import {
  notifyAdminsInApp,
  notifyAdminsEmail,
} from "../utils/notifyAdmins.js";
const router = express.Router();

/*
=================================================
 CREATE MOUs (REGISTER)
=================================================
*/

router.post("/register", auth, async (req, res) => {
  try {
    const data = req.body;

    // Anonymize non-privileged creators (partners) — the visible
    // `created_by_name` and `contact_person` become "Unknown user" so
    // the partner's real identity is not exposed to admins in the
    // inbox, chat header, or any list view.
    const creatorRole = req.user?.role || "partner";
    const isPrivilegedCreator =
      creatorRole === "admin" || creatorRole === "executive";
    const displayCreatorName = isPrivilegedCreator
      ? req.user?.name || "Admin"
      : "Unknown user";
    const displayContactPerson = isPrivilegedCreator
      ? data.contactPerson
      : "Unknown user";

   const payload = {
  // Basic MoU information
  partnerName: data.partnerName,
  country: data.country,
  sector: data.sector,
  description: data.description,
  objectives: data.objectives,

  // Partnership details
  funding_type: data.fundingType || "Non-funded",
  confidentiality: data.confidentiality || "Standard",
  duration: data.duration,
  expected_duration: data.expectedDuration,

  // Workflow
  current_step: data.currentStep || 1,
  status: data.status || "Pending Validation",

  // Documents
  initial_document_url: data.initialDocumentUrl || null,
  file_url: data.fileUrl || null,
  signed_document_url: data.signedDocumentUrl || null,

  // Contact information (anonymized for partner creators)
  contact_person: displayContactPerson,
  contact_email: data.contactEmail,
  contact_phone: data.contactPhone,

  // Partnership classification
  partnership_type: data.partnershipType,
  priority_level: data.priorityLevel,

  // Additional contact fields
  contact_name: displayContactPerson,
  phone: data.contactPhone,
  organization: data.organization,

  // Tracking
  created_by: req.user?.id || null,
  last_modified_by: req.user?.id || null,
  signing_date: data.signingDate || null,
  date_initiated: data.dateInitiated || new Date().toISOString(),

  // Audit (anonymized for non-privileged creators)
  created_by_name: displayCreatorName,
  created_by_email: req.user?.email || null,
  created_by_role: creatorRole,

  // Timestamps
  created_at: new Date().toISOString(),
};
    const { data: result, error } = await supabase
      .from("mous")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.error("❌ MoU INSERT ERROR:", error);

      return res.status(500).json({
        success: false,
        msg: error.message,
      });
    }

    console.log("✅ MoU created:", result.id);

    // 1. IN-APP NOTIFICATION — notify every admin, skip creator if admin
    try {
      await notifyAdminsInApp({
        title: "New MoU Initiated",
        message: `${displayCreatorName} submitted a new MoU with ${data.partnerName} (${data.country}) for validation.`,
        link: `/mou/${result.id}`,
        skipUserId: req.user?.id || null,
      });
    } catch (notifErr) {
      console.error("⚠️ In-app notification failed:", notifErr);
    }

    // 2. EMAIL NOTIFICATION — send to all admin users
    try {
      await notifyAdminsEmail({
        subject: `[RP-LEO System] New MoU Submitted: ${data.partnerName}`,
        htmlContent: getMouSubmittedTemplate(
          data.partnerName,
          data.country,
          data.description,
          result.id,
          displayCreatorName,
        ),
        skipUserId: req.user?.id || null,
      });
    } catch (emailErr) {
      console.error("⚠️ Email Delivery Failed:", emailErr);
    }

    // 📝 AUDIT LOG (queued, retry-safe, lean payload)
    await logAction(
      PayloadBuilders.mouCreated({
        mou: result,
        actor: {
          id: req.user?.id,
          name: req.user?.name,
          role: req.user?.role,
        },
        context: contextFromReq(req),
      })
    );

    return res.status(201).json({
      success: true,
      message: "MoU Registered Successfully",
      data: result,
    });
  } catch (err) {
    console.error("💥 REGISTER ERROR:", err);

    return res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
});
/*
=================================================
 GET ALL MOUs
 IMPORTANT:
 MUST COME BEFORE /:id
=================================================
*/

router.get("/all", auth, async (req, res) => {
  try {
    const isAdmin =
      req.user?.role === "admin" || req.user?.role === "executive";

    let query = supabase
      .from("mous")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!isAdmin) {
      const { data: allowedMous, error: mouError } = await supabase
        .from("mous")
        .select("id")
        .or(
          `contact_email.eq.${req.user?.email},created_by.eq.${req.user?.id}`
        );

      if (mouError) {
        console.error("❌ FETCH ERROR (allowed MoUs):", mouError);
        return res.status(500).json({
          message: "Error fetching registry",
          error: mouError.message,
        });
      }

      const allowedIds = (allowedMous || []).map((m) => m.id);

      if (allowedIds.length === 0) {
        return res.json([]);
      }

      query = query.in("id", allowedIds);
    }

    const { data, error } = await query;

    if (error) {
      console.error("❌ FETCH ERROR:", error);

      return res.status(500).json({
        message: "Error fetching registry",
        error: error.message,
      });
    }

    return res.json(data || []);
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
 GET MY MOUs
 IMPORTANT:
 MUST COME BEFORE /:id
=================================================
*/

router.get("/my-mous", auth, async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { data, error } = await supabase
      .from("mous")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("❌ MY MOUS ERROR:", error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }

    console.log("✅ MY MOUS:", data?.length || 0);

    return res.json(data || []);
  } catch (err) {
    console.error("💥 MY MOUS CRASH:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
=================================================
 GET DASHBOARD STATS (AGGREGATED ANALYTICS)
 MUST COME BEFORE /:id
=================================================
*/

router.get("/stats", auth, async (req, res) => {
  try {
    const isAdmin =
      req.user?.role === "admin" || req.user?.role === "executive";

    // Build the same base query as /all — admin/executive see everything,
    // staff/partner see only their own MoUs.
    let query = supabase.from("mous").select("*");

    if (!isAdmin) {
      const { data: allowedMous, error: mouError } = await supabase
        .from("mous")
        .select("id")
        .or(
          `contact_email.eq.${req.user?.email},created_by.eq.${req.user?.id}`
        );

      if (mouError) {
        return res.status(500).json({ success: false, message: mouError.message });
      }

      const allowedIds = (allowedMous || []).map((m) => m.id);
      if (allowedIds.length === 0) {
        return res.json({
          success: true,
          total: 0,
          byStatus: {},
          byCountry: [],
          bySector: [],
          recentActivity: [],
          monthlyTrend: [],
        });
      }
      query = query.in("id", allowedIds);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const mous = data || [];
    const total = mous.length;

    // Count verified partner accounts that can use the web application.
    const { count: partnerCount, error: partnerError } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .in("role", ["staff", "partner"])
      .eq("email_verified", true);

    if (partnerError) {
      console.warn("⚠️ Partner count unavailable:", partnerError.message);
    }

    // --- byStatus ---
    const byStatus = {};
    for (const m of mous) {
      const s = m.status || "Unknown";
      byStatus[s] = (byStatus[s] || 0) + 1;
    }

    // --- byCountry (top 10) ---
    const countryMap = {};
    for (const m of mous) {
      const c = m.country || "Unknown";
      countryMap[c] = (countryMap[c] || 0) + 1;
    }
    const byCountry = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // --- bySector ---
    const sectorMap = {};
    for (const m of mous) {
      const s = m.sector || "Unknown";
      sectorMap[s] = (sectorMap[s] || 0) + 1;
    }
    const bySector = Object.entries(sectorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // --- recentActivity (last 10 by updated_at) ---
    const recentActivity = mous
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updated_at || b.updatedAt || 0).getTime() -
          new Date(a.updated_at || a.updatedAt || 0).getTime()
      )
      .slice(0, 10)
      .map((m) => ({
        id: m.id,
        partnerName: m.partnerName,
        country: m.country,
        status: m.status || "Unknown",
        updated_at: m.updated_at || m.updatedAt || m.created_at,
        created_by_name: m.created_by_name,
      }));

    // --- monthlyTrend (last 6 months) ---
    const now = new Date();
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth();
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      const count = mous.filter((m) => {
        const cd = new Date(m.created_at || m.createdAt || 0);
        return cd.getFullYear() === year && cd.getMonth() === month;
      }).length;
      monthlyTrend.push({ label, count });
    }

    return res.json({
      success: true,
      total,
      partnerCount: partnerError ? 0 : partnerCount || 0,
      byStatus,
      byCountry,
      bySector,
      recentActivity,
      monthlyTrend,
    });
  } catch (err) {
    console.error("💥 STATS CRASH:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/*
=================================================
 GET SINGLE MOU
 MUST COME AFTER /all and /my-mous
=================================================
*/

router.get("/:id", auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("mous")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      console.error("❌ SINGLE FETCH ERROR:", error);

      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.json(data);
  } catch (err) {
    console.error("💥 SINGLE FETCH CRASH:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

/*
=================================================
 UPDATE MOUs (ADMIN / EXECUTIVE ONLY)
 Sends notification to the initiating partner
=================================================
*/

router.put("/update/:id", auth, async (req, res) => {
  try {
    if (!["admin", "executive"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Access Denied: Insufficient Permissions" });
    }

    const { status, currentStep } = req.body;

    // Fetch the existing record so we can detect actual changes
    const { data: existingMou, error: existingError } = await supabase
      .from("mous")
      .select("status, current_step, partnerName, created_by, contact_email, id")
      .eq("id", req.params.id)
      .maybeSingle();

    if (existingError) {
      return res.status(404).json({ msg: existingError.message || "MoU not found" });
    }

    const updatePayload = {
      status,
      current_step: currentStep,
      last_modified_by: req.user.id,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("mous")
      .update(updatePayload)
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({ msg: error.message || "MoU not found" });
    }

    // 📝 AUDIT LOG (queued, retry-safe, lean payload — only changed fields)
    await logAction(
      PayloadBuilders.mouUpdated({
        before: existingMou,
        after: data,
        actor: {
          id: req.user.id,
          name: req.user.name,
          role: req.user.role,
        },
        context: contextFromReq(req),
      })
    );

    // 🔔 NOTIFY PARTNER — only when status or step actually changes
    const statusChanged = existingMou && existingMou.status !== status;
    const stepChanged = existingMou && existingMou.current_step !== currentStep;
    const partnerUserId = existingMou?.created_by;

    if (partnerUserId) {
      // Notify on status change (e.g. approved)
      if (statusChanged) {
        try {
          await sendNotification({
            title: "MoU Status Updated",
            message: `Your MoU with ${existingMou.partnerName} has been updated to '${status}'.`,
            type: "mou",
            userId: partnerUserId,
            link: `/mou/${data.id}`,
          });
        } catch (notifErr) {
          console.error("⚠️ Status change notification failed:", notifErr);
        }
      }

      // Notify on step change
      if (stepChanged) {
        try {
          const prevStep = existingMou.current_step || "N/A";
          await sendNotification({
            title: "MoU Step Advanced",
            message: `Your MoU with ${existingMou.partnerName} moved from step ${prevStep} to step ${currentStep}.`,
            type: "mou",
            userId: partnerUserId,
            link: `/mou/${data.id}`,
          });
        } catch (notifErr) {
          console.error("⚠️ Step change notification failed:", notifErr);
        }
      }
    }

    // Email the partner only when an admin/executive actually changes status.
    // Do not send this partner notification to administrative accounts.
    if (statusChanged && (existingMou?.contact_email || partnerUserId)) {
      try {
        let contactUser = null;
        let contactUserError = null;

        if (existingMou.contact_email) {
          ({ data: contactUser, error: contactUserError } = await supabase
            .from("users")
            .select("email, role")
            .eq("email", existingMou.contact_email)
            .maybeSingle());
        }

        if (contactUserError) {
          console.warn("Partner email role lookup failed:", contactUserError.message);
        }

        const contactIsAdmin = ["admin", "executive"].includes(
          String(contactUser?.role || "").toLowerCase()
        );

        let recipientEmail = existingMou.contact_email;

        // Some older MoUs have no contact email. Use the initiating partner's
        // account email as a safe fallback, but never notify admin/executive.
        if (!recipientEmail && partnerUserId) {
          const { data: creator } = await supabase
            .from("users")
            .select("email, role")
            .eq("id", partnerUserId)
            .maybeSingle();
          if (!["admin", "executive"].includes(String(creator?.role || "").toLowerCase())) {
            recipientEmail = creator?.email || null;
          }
        }

        if (!contactIsAdmin && recipientEmail) {
          const frontendUrl = (
            process.env.FRONTEND_URL || "https://rp-leo-platform.vercel.app"
          ).replace(/\/$/, "");
          const mouUrl = `${frontendUrl}/messages/${data.id}`;

          await sendEmailNotification({
            to: recipientEmail,
            subject: `[RP-LEO System] MoU status updated: ${existingMou.partnerName}`,
            htmlContent: getMouStatusTemplate(
              existingMou.partnerName,
              status,
              currentStep,
              mouUrl,
            ),
          });
        }
      } catch (emailErr) {
        // The update must remain successful even if an external email service fails.
        console.error("Partner status email notification failed:", emailErr.message);
      }
    }

    return res.json({ success: true, data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating registry entry", error: err.message });
  }
});

/*
=================================================
 SIGN MOUs (EXECUTIVE / ADMIN ONLY)
 Sends notification to all stakeholders
=================================================
*/

router.patch("/sign/:id", auth, async (req, res) => {
  try {
    if (!["executive", "admin"].includes(req.user.role)) {
      return res
        .status(403)
        .json({ msg: "Unauthorized: Only Executives can sign MoUs" });
    }

    // 1. Fetch existing record to detect state transition
    const { data: existingMou, error: fetchError } = await supabase
      .from("mous")
      .select("id, status, partnerName, contact_person, created_by")
      .eq("id", req.params.id)
      .maybeSingle();

    if (fetchError) {
      return res
        .status(500)
        .json({ message: "Error fetching MoU", error: fetchError.message });
    }

    if (!existingMou) {
      return res.status(404).json({ message: "MoU not found" });
    }

    // 2. Prevent duplicate signing — skip notifications if already Active
    const alreadySigned = existingMou.status === "Active";

    // 3. Perform the update
    const { data, error } = await supabase
      .from("mous")
      .update({
        status: "Active",
        current_step: 7,
        signing_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      return res
        .status(500)
        .json({ message: "Error during signing phase", error: error.message });
    }

    // 4. Notify initiator (always, even if already signed — they may not know)
    if (data.created_by) {
      try {
        await sendNotification({
          title: "MoU Signed & Active",
          message: `Your MoU partnership with ${data.partnerName} is now official and Active.`,
          type: "mou",
          userId: data.created_by,
          link: `/mou/${data.id}`,
        });
      } catch (notifErr) {
        console.error("⚠️ Sign notification failed:", notifErr);
      }
    }

    // 5. Notify all admins (only if this is a fresh signing, not a re-sign)
    if (!alreadySigned) {
      try {
        await notifyAdminsInApp({
          title: "MoU Signed & Active",
          message: `MoU with ${data.partnerName} has been signed and is now Active.`,
          link: `/mou/${data.id}`,
          skipUserId: req.user?.id || null,
        });
      } catch (notifErr) {
        console.error("⚠️ Admin in-app notification failed:", notifErr);
      }

      try {
        await notifyAdminsEmail({
          subject: `[RP-LEO System] MoU Signed: ${data.partnerName}`,
          htmlContent: getMouSignedTemplate(
            data.partnerName,
            data.contact_person,
            data.id,
            data.signing_date,
            req.user?.name || "Executive",
          ),
          skipUserId: req.user?.id || null,
        });
      } catch (emailErr) {
        console.error("⚠️ Admin email notification failed:", emailErr);
      }
    }

    // 📝 AUDIT LOG (queued, retry-safe, lean payload)
    await logAction(
      PayloadBuilders.mouSigned({
        mou: data,
        actor: {
          id: req.user.id,
          name: req.user.name,
          role: req.user.role,
        },
        context: contextFromReq(req),
      })
    );

    return res.json({ success: true, data });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error during signing phase", error: err.message });
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

    // 📝 AUDIT LOG (queued, retry-safe, lean payload)
    await logAction(
      PayloadBuilders.mouDeleted({
        mouId: req.params.id,
        actor: {
          id: req.user.id,
          name: req.user.name,
          role: req.user.role,
        },
        context: contextFromReq(req),
      })
    );

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
