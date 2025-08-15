import { Client, Users, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // apna endpoint lagao
  .setProject("VITE_APPWRITE_PROJECT_ID") // apna project ID
  .setKey("VITE_APPWRITE_ADMIN_API_KEY"); // ⚠️ sirf local testing ke liye

export const users = new Users(client);
export const account = new Account(client);
