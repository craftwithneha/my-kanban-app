import { databases, account } from "../appwrite";

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

export const fetchAllUsers = async () => {
  try {
    console.log("Fetching all Appwrite auth users...");
    
    let allUsers = [];
    
    // 1. Get users from your custom users collection (these are users who signed up)
    if (DB_ID && USERS_COLLECTION_ID) {
      try {
        const customUsersRes = await databases.listDocuments(DB_ID, USERS_COLLECTION_ID);
        const customUsers = (customUsersRes.documents || []).map((doc) => ({
          id: doc.$id,
          name: doc.name || doc.email || doc.$id,
          email: doc.email || "",
        }));
        allUsers = [...allUsers, ...customUsers];
        console.log("Custom users found:", customUsers.length);
      } catch (err) {
        console.warn("Could not fetch custom users:", err);
      }
    }
    
    // 2. Get current authenticated user and add if not already in list
    try {
      const currentUser = await account.get();
      if (currentUser && currentUser.$id) {
        const authUser = {
          id: currentUser.$id,
          name: currentUser.name || currentUser.email || currentUser.$id,
          email: currentUser.email || "",
        };
        
        // Check if user already exists in allUsers
        const exists = allUsers.find(u => u.id === authUser.id);
        if (!exists) {
          allUsers.push(authUser);
          console.log("Current auth user added:", authUser);
        }
      }
    } catch (err) {
      console.warn("Could not get current user:", err);
    }
    
    // 3. Remove duplicates and format
    const uniqueUsers = allUsers.filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );
    
    console.log("Total unique users for assignment:", uniqueUsers.length);
    return uniqueUsers;
    
  } catch (err) {
    console.error("fetchAllUsers failed:", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack
    });
    return [];
  }
};
