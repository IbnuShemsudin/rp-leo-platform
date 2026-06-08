import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MessageSquare, Loader2, Shield, User } from "lucide-react";

const API = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URL";

export default function Inbox() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH CONVERSATIONS
  // =========================
  const fetchInbox = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/api/inbox`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-auth-token": token,
        },
      });

      const data = await res.json();

      console.log("INBOX:", data);

      setConversations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("INBOX ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchInbox();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#05070a] text-white p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight">
          Inbox
        </h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">
          All partnership conversations
        </p>
      </div>

      {/* CONTENT */}
      <div className="space-y-4">

        {loading ? (
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 className="animate-spin" />
            Loading inbox...
          </div>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">No conversations yet</p>
        ) : (
          conversations.map((chat) => {
            const isAdminLast =
              chat.lastMessage?.senderRole === "admin";

            return (
              <div
                key={chat.mouId}
                onClick={() => navigate(`/messages/${chat.mouId}`)}
                className="cursor-pointer bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all rounded-2xl p-5 flex items-center justify-between"
              >

                {/* LEFT */}
                <div className="flex items-center gap-4">

                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                    <MessageSquare size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold uppercase tracking-wide text-sm">
                      {chat.mouTitle || "Partnership Chat"}
                    </h2>

                    <p className="text-xs text-gray-400 truncate max-w-[250px]">
                      {chat.lastMessage?.text ||
                        "No messages yet"}
                    </p>
                  </div>

                </div>

                {/* RIGHT */}
                <div className="text-right">

                  <div className="flex items-center gap-2 justify-end">

                    {isAdminLast ? (
                      <Shield size={14} className="text-blue-400" />
                    ) : (
                      <User size={14} className="text-gray-400" />
                    )}

                    <span className="text-[10px] uppercase text-gray-400">
                      {chat.lastMessage?.senderRole}
                    </span>

                  </div>

                  <p className="text-[10px] text-gray-500 mt-1">
                    {chat.lastMessage?.created_at
                      ? new Date(
                          chat.lastMessage.created_at
                        ).toLocaleString()
                      : ""}
                  </p>

                </div>

              </div>
            );
          })
        )}

      </div>
    </div>
  );
}