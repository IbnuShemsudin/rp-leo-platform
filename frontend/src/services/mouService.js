const API = import.meta.env.VITE_API_URL || "import.meta.env.VITE_API_URLL";

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  'x-auth-token': token
});

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