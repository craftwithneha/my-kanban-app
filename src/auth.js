import { account, databases, ID } from "./appwrite";
import { Permission, Role } from "appwrite";

const DB_ID  = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS  = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

// Signup: create account, then create a "users" document so it appears in dropdowns
export const signupUser = async (email, password, name) => {
  try {
    console.log("Creating new user account...");
    await account.create(ID.unique(), email, password, name);
    
    // Immediately create session so we can call account.get()
    await account.createEmailPasswordSession(email, password);
    const me = await account.get();
    console.log("User account created:", me.$id);

    // Save to users collection (doc id = user id for easy joins)
    try {
      const userDoc = await databases.createDocument(
        DB_ID,
        USERS,
        me.$id,
        {
          id: me.$id,
          name: me.name || name || "",
          email: me.email || email || "",
          createdAt: new Date().toISOString(),
          status: "active"
        },
        [Permission.read(Role.users())]
      );
      console.log("User document created successfully in collection:", userDoc.$id);
    } catch (e) {
      console.warn("Could not create users doc (maybe exists):", e?.message);
    }
    return me;
  } catch (error) {
    console.error("Signup failed:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log("Logging in user...");
    await account.createEmailPasswordSession(email, password);
    const me = await account.get();
    console.log("User logged in:", me.$id);
    
    // Upsert user doc to ensure it's present and updated
    try {
      await databases.updateDocument(
        DB_ID,
        USERS,
        me.$id,
        {
          id: me.$id,
          name: me.name || "",
          email: me.email || "",
          lastLogin: new Date().toISOString(),
          status: "active"
        },
        [Permission.read(Role.users())]
      );
      console.log("User document updated successfully");
    } catch {
      console.log("User document not found, creating new one...");
      try {
        // If update fails, try to create
        await databases.createDocument(
          DB_ID,
          USERS,
          me.$id,
          {
            id: me.$id,
            name: me.name || "",
            email: me.email || "",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            status: "active"
          },
          [Permission.read(Role.users())]
        );
        console.log("User document created after login");
      } catch (e2) {
        console.warn("Could not upsert users doc after login:", e2?.message);
      }
    }
    return me;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  await account.deleteSession("current");
};

export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch {
    return null;
  }
};
