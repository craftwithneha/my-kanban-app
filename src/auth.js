import { account, databases, ID } from "./appwrite";
import { Permission, Role } from "appwrite";

const DB_ID  = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const USERS  = import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID;

// Signup: create account, then create a "users" document so it appears in dropdowns
export const signupUser = async (email, password, name) => {
  const user = await account.create(ID.unique(), email, password, name);
  // Immediately create session so we can call account.get()
  await account.createEmailPasswordSession(email, password);
  const me = await account.get();

  // Save to users collection (doc id = user id for easy joins)
  try {
    await databases.createDocument(
      DB_ID,
      USERS,
      me.$id,
      {
        id: me.$id,
        name: me.name || name || "",
        email: me.email || email || "",
      },
      [Permission.read(Role.users())]
    );
  } catch (e) {
    console.warn("Could not create users doc (maybe exists):", e?.message);
  }
  return me;
};

export const loginUser = async (email, password) => {
  await account.createEmailPasswordSession(email, password);
  const me = await account.get();
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
      },
      [Permission.read(Role.users())]
    );
  } catch (e) {
    try {
      await databases.createDocument(
        DB_ID,
        USERS,
        me.$id,
        {
          id: me.$id,
          name: me.name || "",
          email: me.email || "",
        },
        [Permission.read(Role.users())]
      );
    } catch (e2) {
      console.warn("Could not upsert users doc after login:", e2?.message);
    }
  }
  return me;
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
