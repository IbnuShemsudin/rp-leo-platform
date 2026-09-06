/**
 * Resolve a human-readable display name for a user.
 *
 * Falls back cleanly when fields are missing:
 *   - "Sara Tadesse"      -> "Sara Tadesse"
 *   - "  "                -> fallback
 *   - null / undefined    -> fallback
 *
 * @param {Object} person  The user object or message sender payload.
 * @param {Object} [opts]
 * @param {string} [opts.fallback="Unknown user"] Label used when no name exists.
 * @param {string} [opts.role]  Optional role to use as a secondary fallback
 *                              (e.g. "Admin" / "Partner").
 * @returns {string}
 */
export const getDisplayName = (person, opts = {}) => {
  if (!person || typeof person !== "object") {
    return opts.fallback || "Unknown user";
  }

  const candidates = [
    person.name,
    person.fullName,
    person.full_name,
    person.displayName,
    person.display_name,
  ];

  for (const c of candidates) {
    if (typeof c === "string") {
      const trimmed = c.trim();
      if (trimmed) return trimmed;
    }
  }

  // Email-style fallback (e.g. "isrubest18@gmail.com" -> "isrubest18")
  if (typeof person.email === "string" && person.email.includes("@")) {
    const local = person.email.split("@")[0].trim();
    if (local) return local;
  }

  if (opts.role) {
    const r = String(opts.role).toLowerCase();
    if (r === "admin") return "Admin";
    if (r === "executive") return "Executive";
    if (r === "staff" || r === "partner") return "Partner";
  }

  return opts.fallback || "Unknown user";
};

/**
 * Get the first letter(s) of a name for avatar use. Falls back to "U".
 */
export const getInitials = (person, fallback = "U") => {
  const name = getDisplayName(person, { fallback: "" });
  if (!name) return fallback;
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return fallback;
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};
