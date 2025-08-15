import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client, Users } from "node-appwrite";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Appwrite client (SERVER SDK)
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_ADMIN_API_KEY);

const users = new Users(client);

// Get ALL users (raw)

app.get("/users", async (_req, res) => {
  try {
    const result = await users.list();

    // sirf name, email, aur id return karenge
    const simplifiedUsers = result.users.map(u => ({
      id: u.$id,
      name: u.name,
      email: u.email
    }));

    res.json(simplifiedUsers);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Minimal users for dropdown (safe shape)
app.get("/users/min", async (_req, res) => {
  try {
    const result = await users.list();
    const minimal = result.users.map(u => ({
      $id: u.$id,
      name: u.name,
      email: u.email
    }));
    res.json({ users: minimal });
  } catch (err) {
    console.error("Error /users/min:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`✅ Backend running on http://localhost:${process.env.PORT}`);
});
