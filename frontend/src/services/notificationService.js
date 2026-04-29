const API = import.meta.env.VITE_API_URL;

export const getNotifications = async (token) => {
  const res = await fetch(`${API}/api/notifications`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.json();
};