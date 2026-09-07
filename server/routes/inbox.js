import express from "express";
import auth from "../middleware/auth.js";
import { supabase } from "../config/supabase.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const isAdmin =
      req.user?.role === "admin" ||
      req.user?.role === "executive";

    let allowedMouIds = null;

    if (!isAdmin) {
      // Staff / partner: first find the MoUs they're connected to.
      // A user is connected when:
      //   - mous.contact_email matches their login email, OR
      //   - mous.created_by matches their user id
      const { data: allowedMous, error: mouError } = await supabase
        .from("mous")
        .select("id")
        .or(
          `contact_email.eq.${req.user?.email},created_by.eq.${req.user?.id}`
        );

      if (mouError) {
        console.error("INBOX MOU fetch error:", mouError);
        return res.status(500).json({ error: mouError.message });
      }

      allowedMouIds = (allowedMous || []).map((m) => m.id);

      if (allowedMouIds.length === 0) {
        // User has no allowed MoUs → return empty inbox
        return res.json([]);
      }
    }

    // Fetch messages.
    // Admin / executive: all messages.
    // Staff / partner: only messages from their allowed MoUs.
    const messagesQuery = supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isAdmin && allowedMouIds && allowedMouIds.length > 0) {
      messagesQuery.in("mou_id", allowedMouIds);
    }

    const { data: messages, error: msgError } =
      await messagesQuery;

    if (msgError) {
      console.error("INBOX ERROR:", msgError);
      return res.status(500).json({ error: msgError.message });
    }

    // Group by mou_id and capture the latest message, all distinct
    // senders, and the count of unread messages (read_at IS NULL).
    const grouped = new Map();
    for (const msg of messages || []) {
      const key = msg.mou_id;
      if (!key) continue;
      const existing = grouped.get(key);
      const isUnread = !msg.read_at;
      if (!existing) {
        grouped.set(key, {
          mouId: key,
          lastMessage: msg,
          participants: new Set([msg.sender].filter(Boolean)),
          unreadCount: isUnread ? 1 : 0,
        });
      } else {
        if (msg.sender) existing.participants.add(msg.sender);
        if (isUnread) existing.unreadCount += 1;
      }
    }

    // Enrich each conversation with MoU metadata.
    const mouIds = Array.from(grouped.keys());
    let mousById = new Map();
    if (mouIds.length > 0) {
      const { data: mous, error: mouError } = await supabase
        .from("mous")
        .select(
          "id, partnerName, country, contact_person, contact_email, created_by_name, created_by_email"
        )
        .in("id", mouIds);

      if (mouError) {
        console.warn("INBOX MOU enrichment warning:", mouError.message);
      } else {
        mousById = new Map((mous || []).map((m) => [m.id, m]));
      }
    }

    const currentUserEmail = req.user?.email || null;
    const currentUserId = req.user?.id || null;

    // Collect unique participant emails/ids that aren't the current user
    // so we can batch-lookup their real names from the users table.
    const otherPartyIds = new Set();
    for (const entry of grouped.values()) {
      for (const p of entry.participants) {
        if (p && p !== currentUserEmail && p !== currentUserId) {
          otherPartyIds.add(p);
        }
      }
    }

    // Batch lookup: find users whose email or id matches the other-party values
    let usersByName = new Map();
    if (otherPartyIds.size > 0) {
      const idArr = Array.from(otherPartyIds);
      // Try email match first
      const { data: byEmail } = await supabase
        .from("users")
        .select("id, name, email")
        .in("email", idArr);
      // Then try id match (uuid format)
      const uuidIds = idArr.filter((v) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v)
      );
      let byId = [];
      if (uuidIds.length > 0) {
        const res = await supabase
          .from("users")
          .select("id, name, email")
          .in("id", uuidIds);
        byId = res.data || [];
      }
      for (const u of [...(byEmail || []), ...byId]) {
        if (u.name) usersByName.set(u.email, u.name);
        if (u.name) usersByName.set(u.id, u.name);
      }
    }

    const inbox = Array.from(grouped.values()).map((entry) => {
      const mou = mousById.get(entry.mouId) || {};

      const participants = Array.from(entry.participants);
      const otherPartyRaw =
        participants.find(
          (p) => p && p !== currentUserEmail && p !== currentUserId
        ) || null;

      // Resolve display name with a clear priority. Message sender is first:
      // it is the conversation participant, while MoU contact fields may be
      // intentionally anonymized for privacy.
      let displayName = "Unknown user";
      if (otherPartyRaw && usersByName.has(otherPartyRaw)) {
        displayName = usersByName.get(otherPartyRaw);
      } else if (otherPartyRaw && otherPartyRaw.toLowerCase() !== "unknown user") {
        displayName = otherPartyRaw.includes("@")
          ? otherPartyRaw.split("@")[0]
          : otherPartyRaw;
      } else if (mou.contact_person) {
        displayName = mou.contact_person;
      } else if (mou.created_by_name) {
        displayName = mou.created_by_name;
      } else if (mou.partnerName) {
        displayName = mou.partnerName;
      }

      return {
        ...entry,
        participants: undefined,
        unreadCount: entry.unreadCount || 0,
        mou: {
          id: mou.id || entry.mouId,
          partnerName: mou.partnerName || null,
          country: mou.country || null,
          contact_person: mou.contact_person || null,
          contact_email: mou.contact_email || null,
          created_by_name: mou.created_by_name || null,
          created_by_email: mou.created_by_email || null,
        },
        otherParty: otherPartyRaw,
        displayName,
      };
    });

    // Sort by latest message time (most recent first)
    inbox.sort(
      (a, b) =>
        new Date(b.lastMessage?.created_at || 0).getTime() -
        new Date(a.lastMessage?.created_at || 0).getTime()
    );

    res.json(inbox);
  } catch (err) {
    console.error("INBOX SERVER ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
