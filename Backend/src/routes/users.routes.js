import express from "express";
import { getDb } from "../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection("users").find({}).toArray();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
