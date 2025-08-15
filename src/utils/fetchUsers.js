

export const fetchAllUsers = async () => {
  try {
    const res = await fetch("/api/users"); // proxy ke zariye backend se
    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  } catch (err) {
    console.error("fetchAllUsers failed:", err);
    return [];
  }
};
