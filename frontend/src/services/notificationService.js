const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  "x-auth-token": token,
  Authorization: `Bearer ${token}`,
});

export const getNotifications = async (token) => {
  const res = await fetch(`${API}/api/notifications`, {
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }
  return res.json();
};

export const markNotificationAsRead = async (id, token) => {
  const res = await fetch(`${API}/api/notifications/${id}/read`, {
    method: "PATCH",
    headers: authHeaders(token),
  });

  if (!res.ok) {
    throw new Error("Failed to mark notification as read");
  }
  return res.json();
};