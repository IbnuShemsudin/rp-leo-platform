const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getAllMous = async (token) => {
  try {
    const res = await fetch(`${API}/api/mou/all`, {
      headers: {
        'x-auth-token': token
      }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch MoUs");
    }

    return await res.json();

  } catch (error) {
    console.error("MoU Service Error:", error);
    return [];
  }
};