const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'x-auth-token': token,
  'Authorization': `Bearer ${token}` // Dual-compatibility for standard JWT & custom token headers
});

/*
=================================================
 MOU SERVICE ENDPOINTS
=================================================
*/

export const getAllMous = async (token) => {
  try {
    const res = await fetch(`${API}/api/mou/all`, {
      headers: authHeaders(token)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || "Failed to fetch MoUs");
    }

    return await res.json();
  } catch (error) {
    console.error("MoU Service Error:", error);
    return [];
  }
};

export const registerMoU = async (data, token) => {
  try {
    const res = await fetch(`${API}/api/mou/register`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || 'Unable to submit MoU');
    }

    return await res.json();
  } catch (error) {
    console.error("MoU Registration Error:", error);
    throw error;
  }
};

export const updateMoU = async (id, data, token) => {
  try {
    const res = await fetch(`${API}/api/mou/update/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || 'Unable to update MoU');
    }

    return await res.json();
  } catch (error) {
    console.error("MoU Update Error:", error);
    throw error;
  }
};

export const getMouStats = async (token) => {
  try {
    const res = await fetch(`${API}/api/mou/stats`, {
      headers: authHeaders(token)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || 'Failed to fetch stats');
    }

    return await res.json();
  } catch (error) {
    console.error("MoU Stats Error:", error);
    return { total: 0, byStatus: {}, byCountry: [], bySector: [], recentActivity: [], monthlyTrend: [] };
  }
};

export const signMoU = async (id, token) => {
  try {
    const res = await fetch(`${API}/api/mou/sign/${id}`, {
      method: 'PATCH',
      headers: authHeaders(token)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || 'Unable to sign MoU');
    }

    return await res.json();
  } catch (error) {
    console.error("MoU Signing Error:", error);
    throw error;
  }
};

/*
=================================================
 NOTIFICATION SERVICE ENDPOINTS
=================================================
*/

export const getNotifications = async (token) => {
  try {
    const res = await fetch(`${API}/api/notifications`, {
      headers: authHeaders(token)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || 'Failed to fetch notifications');
    }

    return await res.json();
  } catch (error) {
    console.error("Notifications Fetch Error:", error);
    return [];
  }
};

export const markNotificationAsRead = async (id, token) => {
  try {
    const res = await fetch(`${API}/api/notifications/${id}/read`, {
      method: 'PATCH',
      headers: authHeaders(token)
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.msg || body.message || 'Unable to update notification');
    }

    return await res.json();
  } catch (error) {
    console.error("Mark Notification Read Error:", error);
    throw error;
  }
};