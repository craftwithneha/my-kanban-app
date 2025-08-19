// Fetch users from deployed backend
const BACKEND_URL = "https://kanbanbackend-omega.vercel.app";

export const fetchAllUsers = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/users`);
    if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("fetchAllUsers failed:", err);
    return [];
  }
};
