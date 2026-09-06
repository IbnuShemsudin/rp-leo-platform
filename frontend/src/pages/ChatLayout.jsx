import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getDisplayName, getInitials } from "../utils/displayName";
import NotificationBell from "../components/NotificationBell";
import {
  Search,
  Send,
  ArrowLeft,
  MessageSquare,
  Loader2,
  Shield,
  User,
  Check,
  CheckCheck,
  Wifi,
  WifiOff,
  MoreVertical,
  X,
  Pin,
  Archive,
  Inbox as InboxIcon,
  Plus,
  Hash,
  Home,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ============================================================
 * Theme tokens (kept consistent with the rest of the project)
 *   gold   #DE984B
 *   blue   #1E3A8A
 *   teal   #00A8B5
 *   bg     #070B12 / #0A0F17
 * ============================================================ */


/* ============================================================
 * Helpers
 * ============================================================ */

const formatRelativeTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const wasYesterday =
    d.getFullYear() === yesterday.getFullYear() &&
    d.getMonth() === yesterday.getMonth() &&
    d.getDate() === yesterday.getDate();

  if (sameDay) {
    return d.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (wasYesterday) return "Yesterday";
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: "short" });
  }
  return d.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
};

const formatBubbleTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isAnonymousLabel = (s) =>
  !s ||
  s.toLowerCase() === "unknown user" ||
  s.toLowerCase() === "unknown";

const hueFromName = (name) => {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
};

/* ============================================================
 * Avatar — circular with deterministic gradient + online dot
 * ============================================================ */

const Avatar = ({ name, size = 48, online = false, ring = false }) => {
  const displayName = getDisplayName({ name }, { fallback: "U" });
  const initials = getInitials({ name: displayName }, "U");
  const px = `${size}px`;
  const hue = hueFromName(displayName);

  return (
    <div
      className="relative shrink-0"
      style={{ width: px, height: px }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center justify-center font-black text-white tracking-wider shadow-inner ${
          ring ? "ring-2 ring-[#DE984B]/60 ring-offset-2 ring-offset-[#070B12]" : ""
        }`}
        style={{
          background: `linear-gradient(135deg, hsl(${hue} 55% 35%), hsl(${
            (hue + 60) % 360
          } 50% 18%))`,
          fontSize: Math.max(11, size * 0.36),
        }}
      >
        {initials}
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-emerald-400 border-2 border-[#070B12]"
          style={{ width: size * 0.28, height: size * 0.28 }}
        />
      )}
    </div>
  );
};

/* ============================================================
 * Conversation list item
 * ============================================================ */

const ConversationItem = ({ chat, active, onClick }) => {
  const isAdminLast =
    chat.lastMessage?.sender_role === "admin" ||
    chat.lastMessage?.sender_role === "executive" ||
    chat.lastMessage?.senderRole === "admin" ||
    chat.lastMessage?.senderRole === "executive";

  // Use the backend-resolved displayName first, then fall back to otherParty fields
  const otherName = chat.displayName
    || (chat.otherParty && !isAnonymousLabel(chat.otherParty) ? chat.otherParty : null)
    || chat.mou?.contact_person
    || chat.mou?.created_by_name
    || chat.mou?.partnerName
    || "Unknown user";

  const partnerLabel =
    chat.mou?.partnerName || chat.mouTitle || "Partnership Chat";

  const lastText = chat.lastMessage?.text || "No messages yet";
  const lastTime = formatRelativeTime(
    chat.lastMessage?.created_at || chat.lastMessage?.createdAt
  );

  const unread = chat.unreadCount || 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full text-left flex items-center gap-3 px-3 sm:px-4 py-3
        transition-all duration-150 border-l-2
        ${
          active
            ? "bg-gradient-to-r from-[#DE984B]/15 via-[#1E3A8A]/10 to-transparent border-[#DE984B]"
            : "border-transparent hover:bg-white/[0.04] active:bg-white/[0.06]"
        }
      `}
    >
      <Avatar name={otherName} size={48} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`text-sm truncate ${
              active ? "text-white font-black" : "text-slate-100 font-bold"
            }`}
          >
            {otherName}
          </h3>
          <span
            className={`text-[10px] font-mono shrink-0 ${
              unread > 0 ? "text-[#DE984B] font-black" : "text-slate-500"
            }`}
          >
            {lastTime}
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <Hash size={9} className="text-slate-600 shrink-0" />
          <span
            className={`text-[9px] font-black uppercase tracking-[0.16em] truncate ${
              isAdminLast ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {partnerLabel}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p
            className={`text-xs truncate ${
              unread > 0
                ? "text-slate-200 font-semibold"
                : "text-slate-500"
            }`}
          >
            {isAdminLast && (
              <span className="text-emerald-400 font-black mr-1">You:</span>
            )}
            {lastText}
          </p>
          {unread > 0 && (
            <span className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full bg-[#DE984B] text-[#111827] text-[10px] font-black flex items-center justify-center shadow-lg shadow-[#DE984B]/30">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

/* ============================================================
 * Message bubble — own / partner / admin variants
 * ============================================================ */

const MessageBubble = ({ msg, mine, prevMine, nextMine, isAdmin }) => {
  const time = formatBubbleTime(msg.created_at || msg.createdAt);
  const isRead = !!msg.read_at;
  const isFirstInGroup = !prevMine;
  const isLastInGroup = !nextMine;

  // Shape the corner that points to the "tail" of the bubble
  const radius = mine
    ? `rounded-2xl ${
        isFirstInGroup ? "rounded-tr-md" : isLastInGroup ? "rounded-br-md" : ""
      }`
    : `rounded-2xl ${
        isFirstInGroup ? "rounded-tl-md" : isLastInGroup ? "rounded-bl-md" : ""
      }`;

  return (
    <div
      className={`flex w-full ${mine ? "justify-end" : "justify-start"} ${
        isFirstInGroup ? "mt-2.5" : "mt-0.5"
      }`}
    >
      <div className="flex items-end gap-1.5 max-w-[82%] sm:max-w-[68%]">
        {/* Avatar (other side only, only on first of a group) */}
        {!mine && isFirstInGroup && (
          <div className="self-end mb-1">
            <Avatar
              name={msg.sender || "Unknown user"}
              size={26}
            />
          </div>
        )}
        {/* Spacer for alignment when avatar is hidden (group continuation) */}
        {!mine && !isFirstInGroup && <div className="w-[26px] shrink-0" />}

        <div
          className={`
            ${radius}
            px-3 py-1.5
            text-[14px] leading-[1.4]
            shadow-md
            ${
              mine
                ? "bg-gradient-to-br from-[#1E3A8A] to-[#1E40AF] text-white"
                : isAdmin
                ? "bg-[#DE984B]/15 border border-[#DE984B]/35 text-slate-100"
                : "bg-[#161D28] border border-white/[0.07] text-slate-100"
            }
          `}
        >
          {/* Sender name above first bubble in a group (other side only) */}
          {!mine && isFirstInGroup && (
            <div
              className={`text-[10px] font-black uppercase tracking-[0.18em] mb-0.5 ${
                isAdmin ? "text-[#DE984B]" : "text-[#00A8B5]"
              }`}
            >
              {msg.sender || "Unknown user"}
            </div>
          )}

          <p className="whitespace-pre-wrap break-words">{msg.text}</p>

          <div
            className={`flex items-center gap-1 mt-0.5 ${
              mine ? "justify-end" : "justify-end"
            }`}
          >
            <span
              className={`text-[10px] font-mono leading-none ${
                mine ? "text-white/55" : "text-slate-500"
              }`}
            >
              {time}
            </span>
            {mine && (
              <span
                className={`${
                  isRead ? "text-[#7DD3FC]" : "text-white/40"
                } leading-none`}
                title={isRead ? "Read" : "Delivered"}
              >
                {isRead ? <CheckCheck size={12} /> : <Check size={12} />}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * Date separator
 * ============================================================ */

const DateSeparator = ({ iso }) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let label;
  if (d.toDateString() === today.toDateString()) label = "Today";
  else {
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    if (d.toDateString() === y.toDateString()) label = "Yesterday";
    else
      label = d.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
        year:
          d.getFullYear() === today.getFullYear() ? undefined : "numeric",
      });
  }
  return (
    <div className="flex items-center justify-center my-3">
      <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
    </div>
  );
};

/* ============================================================
 * Chat panel
 * ============================================================ */

const ChatPanel = ({ mouId, onBack }) => {
  const { token, user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [mouMeta, setMouMeta] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connected");

  const bottomRef = useRef(null);
  const isMounted = useRef(true);
  const taRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const lastMessageIdRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    if (!mouId || !token) return;
    try {
      const res = await fetch(`${API}/api/messages/${mouId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        cache: "no-store",
      });
      if (!res.ok) {
        if (isMounted.current) setConnectionStatus("disconnected");
        return;
      }
      const data = await res.json();
      if (!isMounted.current) return;
      setConnectionStatus("connected");
      setError("");
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.messages)
        ? data.messages
        : [];
      setMessages(list);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      if (isMounted.current) setConnectionStatus("disconnected");
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [mouId, token]);

  const fetchMouMeta = useCallback(async () => {
    if (!mouId || !token) return;
    try {
      const res = await fetch(`${API}/api/mou/${mouId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      if (isMounted.current) setMouMeta(data || null);
    } catch (err) {
      console.warn("MOU meta fetch failed:", err);
    }
  }, [mouId, token]);

  const markRead = useCallback(async () => {
    if (!mouId || !token) return;
    try {
      await fetch(`${API}/api/messages/${mouId}/read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.read_at ? m : { ...m, read_at: new Date().toISOString() }
        )
      );
    } catch (err) {
      console.warn("mark-read failed:", err);
    }
  }, [mouId, token]);

  // Initial load + reset on mouId change
  useEffect(() => {
    isMounted.current = true;
    setLoading(true);
    setMessages([]);
    setMouMeta(null);
    lastMessageCountRef.current = 0;
    lastMessageIdRef.current = null;

    fetchMessages();
    fetchMouMeta();
    markRead();

    return () => {
      isMounted.current = false;
    };
  }, [fetchMessages, fetchMouMeta, markRead]);

  // No auto-refresh; keep Telegram-like behavior without polling.
  // Messages refresh only when the user opens the chat or sends a message.

  // Auto-scroll on new messages
  useEffect(() => {
    const newCount = messages.length;
    const newId = messages[messages.length - 1]?.id;
    if (newCount !== lastMessageCountRef.current) {
      lastMessageCountRef.current = newCount;
      lastMessageIdRef.current = newId;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    const value = text.trim();
    if (!value) return;
    if (!token) {
      setError("Authentication required");
      return;
    }

    setSending(true);
    setError("");

    const tempId = `tmp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      text: value,
      sender: getDisplayName(user, { fallback: "You" }),
      sender_role: user?.role || "partner",
      created_at: new Date().toISOString(),
      read_at: null,
      _pending: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setText("");

    try {
      const res = await fetch(`${API}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          mouId,
          sender: user?.name || user?.email,
          senderRole: user?.role || "partner",
          text: value,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message || "Failed to send");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        return;
      }
      await fetchMessages();
      markRead();
    } catch (err) {
      console.error("SEND ERROR:", err);
      setError(err?.message || "Failed to send message");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSending(false);
      taRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Header name resolution
  const isAdminViewer =
    user?.role === "admin" || user?.role === "executive";

  const otherName = useMemo(() => {
    if (isAdminViewer) {
      return getDisplayName(
        {
          name:
            mouMeta?.contact_person ||
            mouMeta?.created_by_name ||
            mouMeta?.partnerName,
        },
        { fallback: "Unknown user" }
      );
    }
    return getDisplayName(
      {
        name:
          mouMeta?.created_by_name ||
          mouMeta?.contact_person,
      },
      { fallback: "Admin" }
    );
  }, [isAdminViewer, mouMeta]);

  const isMine = useCallback((msg) => {
    if (msg._pending) return true;
    if (!user) return false;

    // Primary: match by sender name against the current user's name
    const myName = (user.name || user.fullName || user.email || "").trim();
    const sender = (msg.sender || "").trim();
    if (myName && sender && myName === sender) return true;

    // Secondary: match by email if sender looks like an email
    if (sender && sender.includes("@") && user.email && sender.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }

    return false;
  }, [user]);

  // Build list with date separators
  const rendered = useMemo(() => {
    const out = [];
    let lastDate = null;
    messages.forEach((m, i) => {
      const d = m.created_at || m.createdAt;
      const day = d ? new Date(d).toDateString() : null;
      if (day && day !== lastDate) {
        out.push({ type: "date", iso: d, key: `d-${day}` });
        lastDate = day;
      }
      out.push({
        type: "msg",
        msg: m,
        mine: isMine(m),
        isAdmin:
          m.sender_role === "admin" || m.sender_role === "executive",
        prevMine: i > 0 && isMine(messages[i - 1]),
        nextMine: i < messages.length - 1 && isMine(messages[i + 1]),
        key: m.id || m._id || `m-${i}`,
      });
    });
    return out;
  }, [messages, isMine]);

  return (
    <div className="flex flex-col h-full bg-[#0A0F17] relative">
      {/* HEADER */}
      <header className="shrink-0 z-10 border-b border-white/[0.06] bg-[#070B12]/95 backdrop-blur-2xl">
        <div className="flex items-center gap-3 px-3 sm:px-5 py-3">
          <button
            onClick={onBack}
            className="md:hidden w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center text-slate-300 hover:bg-white/[0.06] transition"
            aria-label="Back to inbox"
          >
            <ArrowLeft size={17} />
          </button>

          <Avatar name={otherName} size={42} online />

          <div className="flex-1 min-w-0">
            <h2
              className="text-sm font-black text-white truncate"
              title={otherName}
            >
              {otherName}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-emerald-400"
                    : "bg-rose-400"
                }`}
              />
              <span
                className={`text-[10px] font-black uppercase tracking-[0.18em] ${
                  connectionStatus === "connected"
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {connectionStatus === "connected" ? "online" : "offline"}
              </span>
              {mouMeta?.partnerName && (
                <>
                  <span className="text-slate-700 mx-1">•</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-[0.16em] truncate">
                    {mouMeta.partnerName}
                  </span>
                </>
              )}
            </div>
          </div>

          <NotificationBell />

          <button
            className="hidden sm:flex w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] items-center justify-center text-slate-400 hover:text-white transition"
            aria-label="More options"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-b from-[#0A0F17] via-[#0A0F17] to-[#070B12]">
        <div className="max-w-3xl mx-auto px-3 sm:px-5 py-4">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 py-16">
              <Loader2 size={26} className="animate-spin text-[#00A8B5]" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                Loading conversation
              </span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DE984B]/20 to-[#1E3A8A]/20 border border-white/10 flex items-center justify-center mb-4">
                <MessageSquare size={26} className="text-[#DE984B]" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-white">
                No messages yet
              </h3>
              <p className="text-xs text-slate-500 mt-2 max-w-xs">
                Start the conversation by sending a message below.
              </p>
            </div>
          ) : (
            <div>
              {rendered.map((item) =>
                item.type === "date" ? (
                  <DateSeparator key={item.key} iso={item.iso} />
                ) : (
                  <MessageBubble
                    key={item.key}
                    msg={item.msg}
                    mine={item.mine}
                    isAdmin={item.isAdmin}
                    prevMine={item.prevMine}
                    nextMine={item.nextMine}
                  />
                )
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="px-3 sm:px-5 pb-2">
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-2.5">
            <p className="text-xs font-bold text-rose-400">{error}</p>
          </div>
        </div>
      )}

      {/* COMPOSER */}
      <div className="shrink-0 border-t border-white/[0.06] bg-[#070B12]/95 backdrop-blur-2xl px-3 sm:px-5 py-3">
        <div className="max-w-3xl mx-auto flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={taRef}
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              className="
                w-full
                min-h-[44px]
                max-h-32
                bg-[#0A0F17]
                border
                border-white/10
                rounded-2xl
                px-4
                py-2.5
                text-sm
                text-white
                placeholder:text-slate-600
                outline-none
                resize-none
                transition-all
                focus:border-[#DE984B]/50
                focus:ring-2
                focus:ring-[#DE984B]/15
                custom-scrollbar
              "
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>

          <button
            type="button"
            onClick={sendMessage}
            disabled={sending || !text.trim()}
            className={`
              w-11 h-11 shrink-0 rounded-full flex items-center justify-center
              transition-all duration-200
              ${
                sending || !text.trim()
                  ? "bg-white/10 text-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-br from-[#DE984B] to-[#F2B51D] text-[#111827] hover:scale-105 active:scale-95 shadow-lg shadow-[#DE984B]/30"
              }
            `}
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Send size={17} />
            )}
          </button>
        </div>

        <div className="max-w-3xl mx-auto flex items-center justify-between mt-1.5 px-1">
          <span className="text-[9px] uppercase tracking-[0.18em] text-slate-700">
            Enter to send • Shift + Enter for new line
          </span>
          <span className="hidden sm:flex items-center gap-1 text-[9px] uppercase tracking-[0.18em] text-slate-700">
            {connectionStatus === "connected" ? (
              <Wifi size={10} className="text-emerald-500" />
            ) : (
              <WifiOff size={10} className="text-rose-500" />
            )}
            {connectionStatus === "connected" ? "Live" : "Reconnecting"}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ============================================================
 * Conversation list
 * ============================================================ */

const ConversationList = ({
  conversations,
  activeId,
  onSelect,
  searchQuery,
  setSearchQuery,
  loading,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((chat) => {
      const other =
        !isAnonymousLabel(chat.otherParty) ? chat.otherParty : "";
      const partner = chat.mou?.partnerName || "";
      const last = chat.lastMessage?.text || "";
      return (
        other.toLowerCase().includes(q) ||
        partner.toLowerCase().includes(q) ||
        last.toLowerCase().includes(q)
      );
    });
  }, [conversations, searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#070B12]">
      {/* Top brand bar */}
      <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const role = (user?.role || "").toLowerCase();
              const destination =
                role === "admin" || role === "executive"
                  ? "/dashboard"
                  : "/";
              navigate(destination);
            }}
            className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400 hover:text-[#DE984B] hover:border-[#DE984B]/30 transition-all"
            title={
              user?.role === "admin" || user?.role === "executive"
                ? "Back to Dashboard"
                : "Back to Home"
            }
            aria-label={
              user?.role === "admin" || user?.role === "executive"
                ? "Back to Dashboard"
                : "Back to Home"
            }
          >
            <Home size={17} />
          </button>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#DE984B] to-[#1E3A8A] flex items-center justify-center shadow-lg shadow-[#DE984B]/20">
            <MessageSquare size={17} className="text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-white tracking-tight">
              Messages
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.18em] font-bold">
              {conversations.length} conversation
              {conversations.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 sm:px-4 py-3 border-b border-white/[0.06]">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages or partners..."
            className="
              w-full h-10 pl-10 pr-9 rounded-xl
              bg-white/[0.03] border border-white/10
              text-sm text-white placeholder:text-slate-600
              outline-none transition-all
              focus:border-[#DE984B]/50 focus:ring-2 focus:ring-[#DE984B]/15
            "
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16">
            <Loader2 size={22} className="animate-spin text-[#00A8B5]" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
              Loading
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DE984B]/15 to-[#1E3A8A]/15 border border-white/10 flex items-center justify-center mb-3">
              <MessageSquare size={22} className="text-[#DE984B]" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-white">
              {searchQuery ? "No matches" : "No conversations yet"}
            </h3>
            <p className="text-[11px] text-slate-600 mt-2 max-w-[220px]">
              {searchQuery
                ? "Try a different search term."
                : "Partnership chats will appear here once communication begins."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filtered.map((chat) => (
              <ConversationItem
                key={chat.mouId}
                chat={chat}
                active={activeId === chat.mouId}
                onClick={() => onSelect(chat.mouId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
 * Main layout
 * ============================================================ */

export default function ChatLayout() {
  const { mouId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingInbox, setLoadingInbox] = useState(true);

  const fetchInbox = useCallback(async () => {
    if (!token) return;
    try {
      setLoadingInbox(true);
      const res = await fetch(`${API}/api/inbox`, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        cache: "no-store",
      });
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("INBOX ERROR:", err);
      setConversations([]);
    } finally {
      setLoadingInbox(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) fetchInbox();
  }, [token, fetchInbox]);

  // No auto-refresh in the inbox; match Telegram behavior.
  const handleSelect = (selectedMouId) => {
    navigate(`/messages/${selectedMouId}`);
  };

  const handleBack = () => {
    navigate("/messages");
  };

  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mql.addEventListener?.("change", handler);
    return () => mql.removeEventListener?.("change", handler);
  }, []);

  // On desktop, sidebar is always visible and chat panel fills the rest.
  // On mobile/tablet, only one pane is visible at a time.
  const showSidebar = isDesktop || !mouId;
  const showChat = isDesktop || !!mouId;

  return (
    <div className="h-[100dvh] w-full bg-[#070B12] text-slate-100 overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#1E3A8A]/15 blur-[140px]" />
        <div className="absolute -bottom-40 -left-40 h-[450px] w-[450px] rounded-full bg-[#DE984B]/5 blur-[140px]" />
      </div>

      <div className="relative h-full w-full flex">
        {/* =========================================================
            SIDEBAR (conversation list)
            - Desktop (lg+): always visible, 380-420px wide
            - Mobile/tablet: visible only when no chat is selected
          ========================================================= */}
        {showSidebar && (
          <aside className="shrink-0 w-full lg:w-[380px] xl:w-[420px] border-r border-white/[0.06] h-full flex-col bg-[#070B12]">
            <ConversationList
              conversations={conversations}
              activeId={mouId}
              onSelect={handleSelect}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loadingInbox}
            />
          </aside>
        )}

        {/* =========================================================
            CHAT PANEL
            - Desktop (lg+): always visible (empty state or active chat)
            - Mobile/tablet: visible only when a chat is selected
          ========================================================= */}
        {showChat && (
          <main className="flex-1 min-w-0 h-full bg-[#0A0F17]">
            {mouId ? (
            <ChatPanel
              key={mouId}
              mouId={mouId}
              onBack={handleBack}
            />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#0A0F17] to-[#070B12]">
                <div className="relative mb-5">
                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#DE984B]/25 to-[#1E3A8A]/25 border border-white/10 flex items-center justify-center">
                    <MessageSquare
                      size={32}
                      className="text-[#DE984B]"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#070B12] animate-pulse" />
                </div>
                <h2 className="text-base font-black uppercase tracking-[0.18em] text-white">
                  Select a conversation
                </h2>
                <p className="text-xs text-slate-500 mt-2 max-w-xs">
                  Pick a chat from the list to start messaging, or wait for
                  new partnership updates to arrive.
                </p>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}