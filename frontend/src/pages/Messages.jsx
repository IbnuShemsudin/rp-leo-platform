import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import {
  Send,
  Shield,
  User,
  Loader2,
  MessageSquare,
  ArrowLeft,
  Clock3,
  CheckCircle2,
  Wifi,
  WifiOff,
} from "lucide-react";

const API =
  import.meta.env.VITE_API_URL ||
  "http://import.meta.env.VITE_API_URL";

export default function Messages() {
  const { mouId } = useParams();
  const navigate = useNavigate();

  const { token, user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [connectionStatus, setConnectionStatus] =
    useState("connected");

  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const intervalRef = useRef(null);
  const isMounted = useRef(true);

  /*
  =========================
  FETCH MESSAGES
  =========================
  */

  const fetchMessages = useCallback(async () => {
    try {
      if (!mouId || !token) return;

      console.log("📥 FETCHING MESSAGES FOR:", mouId);

      const res = await fetch(
        `${API}/api/messages/${mouId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error(
          "❌ FAILED TO FETCH:",
          res.status
        );

        setConnectionStatus("disconnected");

        return;
      }

      const data = await res.json();

      console.log("✅ MESSAGES:", data);

      if (!isMounted.current) return;

      setConnectionStatus("connected");

      if (Array.isArray(data)) {
        setMessages(data);
      } else if (Array.isArray(data?.messages)) {
        setMessages(data.messages);
      } else {
        setMessages([]);
      }

    } catch (err) {
      console.error("❌ FETCH ERROR:", err);

      setConnectionStatus("disconnected");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [mouId, token]);

  /*
  =========================
  INITIAL LOAD
  =========================
  */

  useEffect(() => {
    isMounted.current = true;

    fetchMessages();

    return () => {
      isMounted.current = false;
    };
  }, [fetchMessages]);

  /*
  =========================
  AUTO REFRESH
  =========================
  */

  useEffect(() => {
    if (!mouId || !token) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [fetchMessages, mouId, token]);

  /*
  =========================
  AUTO SCROLL
  =========================
  */

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
  =========================
  SEND MESSAGE
  =========================
  */

  const sendMessage = async () => {
    try {
      if (!message.trim()) return;

      if (!token) {
        setError("Authentication required");
        return;
      }

      setSending(true);
      setError("");

      const payload = {
        mouId,

        sender:
          user?.name ||
          user?.fullName ||
          user?.email ||
          "Unknown User",

        senderRole:
          user?.role || "partner",

        text: message.trim(),
      };

      console.log("📤 SENDING:", payload);

      const res = await fetch(
        `${API}/api/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-auth-token": token,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      console.log("📨 RESPONSE:", data);

      if (!res.ok) {
        setError(
          data?.message ||
            "Failed to send message"
        );

        return;
      }

      setMessage("");

      // INSTANT REFRESH
      await fetchMessages();

    } catch (err) {
      console.error("❌ SEND ERROR:", err);

      setError(
        err?.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  /*
  =========================
  ENTER KEY
  =========================
  */

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      sendMessage();
    }
  };

  /*
  =========================
  MESSAGE SIDE
  =========================
  */

  const isMyMessage = (msg) => {
    const currentUserName =
      user?.name ||
      user?.fullName ||
      user?.email;

    return (
      msg.sender === currentUserName
    );
  };

  /*
  =========================
  ROLE CHECK
  =========================
  */

  const isAdminMessage = (msg) => {
    return (
      msg.sender_role === "admin" ||
      msg.sender_role === "executive" ||
      msg.senderRole === "admin" ||
      msg.senderRole === "executive"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070a] via-[#090d14] to-[#05070a] text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-rp-gold/10 blur-[120px] rounded-full pointer-events-none" />

      {/* TOP NAV */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#05070a]/80 backdrop-blur-2xl">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={20} />
            </button>

            <div className="flex items-center gap-4">

              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rp-blue to-blue-700 flex items-center justify-center shadow-2xl">
                <MessageSquare size={28} />
              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  Partnership Messages
                </h1>

                <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mt-1">
                  Secure Real-Time Communication
                </p>

              </div>

            </div>

          </div>

          {/* STATUS */}
          <div
            className={`hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl border ${
              connectionStatus === "connected"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-rose-500/10 border-rose-500/20"
            }`}
          >

            {connectionStatus === "connected" ? (
              <Wifi
                size={16}
                className="text-emerald-400"
              />
            ) : (
              <WifiOff
                size={16}
                className="text-rose-400"
              />
            )}

            <span
              className={`text-xs font-black uppercase tracking-widest ${
                connectionStatus === "connected"
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {connectionStatus === "connected"
                ? "Live Connected"
                : "Disconnected"}
            </span>

          </div>

        </div>

      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto p-6 relative z-10">

        <div className="glass-panel bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl backdrop-blur-2xl">

          {/* HEADER */}
          <div className="border-b border-white/10 px-8 py-6 bg-white/[0.02]">

            <div className="flex flex-wrap items-center justify-between gap-5">

              <div>

                <h2 className="font-black uppercase tracking-tight text-xl">
                  Communication Channel
                </h2>

                <p className="text-xs text-gray-400 uppercase tracking-[0.3em] mt-2">
                  MoU ID : {mouId}
                </p>

              </div>

              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-rp-blue/10 border border-rp-blue/20">

                <CheckCircle2
                  size={16}
                  className="text-rp-blue"
                />

                <span className="text-xs font-black uppercase tracking-widest text-rp-blue">
                  Encrypted Channel
                </span>

              </div>

            </div>

          </div>

          {/* MESSAGES AREA */}
          <div className="h-[68vh] overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar">

            {loading ? (
              <div className="h-full flex flex-col items-center justify-center gap-5">

                <Loader2
                  size={42}
                  className="animate-spin text-rp-blue"
                />

                <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-black">
                  Loading Messages...
                </p>

              </div>
            ) : messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center gap-5 opacity-50">

                <MessageSquare size={60} />

                <h3 className="font-black uppercase tracking-widest text-lg">
                  No Messages Yet
                </h3>

                <p className="text-sm text-gray-400">
                  Start the conversation now.
                </p>

              </div>
            ) : (
              messages.map((msg, index) => {
                const mine = isMyMessage(msg);

                const admin =
                  isAdminMessage(msg);

                return (
                  <div
                    key={
                      msg.id ||
                      msg._id ||
                      index
                    }
                    className={`flex ${
                      mine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`relative max-w-[90%] md:max-w-[60%] px-6 py-5 rounded-[28px] shadow-2xl transition-all duration-300 ${
                        mine
                          ? "bg-gradient-to-r from-rp-blue to-blue-700 text-white"
                          : admin
                          ? "bg-emerald-500/10 border border-emerald-500/20"
                          : "bg-white/[0.05] border border-white/10"
                      }`}
                    >

                      {/* HEADER */}
                      <div className="flex items-center gap-3 mb-3">

                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            admin
                              ? "bg-emerald-500/20"
                              : "bg-white/10"
                          }`}
                        >

                          {admin ? (
                            <Shield
                              size={14}
                              className="text-emerald-400"
                            />
                          ) : (
                            <User size={14} />
                          )}

                        </div>

                        <div>

                          <p className="text-xs font-black uppercase tracking-widest opacity-90">

                            {msg.sender ||
                              "Unknown"}

                            {mine &&
                              " • You"}

                          </p>

                          <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mt-1">

                            {admin
                              ? "Administrator"
                              : "Partner"}

                          </p>

                        </div>

                      </div>

                      {/* MESSAGE */}
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>

                      {/* FOOTER */}
                      <div className="flex justify-end mt-4">

                        <div className="flex items-center gap-2 text-[10px] opacity-60">

                          <Clock3 size={11} />

                          <span>
                            {msg.created_at ||
                            msg.createdAt
                              ? new Date(
                                  msg.created_at ||
                                    msg.createdAt
                                ).toLocaleString()
                              : ""}
                          </span>

                        </div>

                      </div>

                      {/* CHAT TAIL */}
                      <div
                        className={`absolute bottom-0 w-4 h-4 rotate-45 ${
                          mine
                            ? "right-[-7px] bg-blue-700"
                            : admin
                            ? "left-[-7px] bg-emerald-500/10 border-l border-b border-emerald-500/20"
                            : "left-[-7px] bg-white/[0.05] border-l border-b border-white/10"
                        }`}
                      />

                    </div>

                  </div>
                );
              })
            )}

            <div ref={bottomRef} />

          </div>

          {/* ERROR */}
          {error && (
            <div className="px-6 pb-4">

              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4">

                <p className="text-sm font-bold text-rose-400">
                  {error}
                </p>

              </div>

            </div>
          )}

          {/* INPUT AREA */}
          <div className="border-t border-white/10 p-6 bg-black/20 backdrop-blur-xl">

            <div className="flex items-end gap-4">

              <div className="flex-1">

                <textarea
                  rows={1}
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={
                    handleKeyPress
                  }
                  placeholder="Type your secure message..."
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-rp-blue focus:ring-2 focus:ring-rp-blue/30 text-sm resize-none transition-all"
                />

              </div>

              <button
                onClick={sendMessage}
                disabled={
                  sending ||
                  !message.trim()
                }
                className={`px-8 h-[60px] rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all duration-300 ${
                  sending ||
                  !message.trim()
                    ? "bg-white/10 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-rp-blue to-blue-700 hover:scale-105 shadow-2xl"
                }`}
              >

                {sending ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <Send size={18} />
                )}

                {sending
                  ? "Sending..."
                  : "Send"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}