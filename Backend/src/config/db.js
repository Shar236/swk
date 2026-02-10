import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Dono variables check kar raha hai
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!uri) {
  console.error("❌ ERROR: MONGODB_URI or MONGO_URI is missing in your .env file!");
  process.exit(1); 
}

const client = new MongoClient(uri);

let db;

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected (Native Driver)");
    db = client.db(); // Agar db name .env mein nahi hai, toh ye default db uthayega
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection error:", error.message);
    process.exit(1);
  }
};

export const getDb = () => {
  if (!db) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return db;
};