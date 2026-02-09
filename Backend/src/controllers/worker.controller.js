import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

export const createProfile = async (req, res) => {
  try {
    const { userId, bio, location, extra } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId required' });
    
    const db = getDb();
    const existing = await db.collection('worker_profiles').findOne({ user: new ObjectId(userId) });
    if (existing) return res.status(400).json({ message: 'Profile already exists' });
    
    const newProfile = {
      user: new ObjectId(userId),
      bio,
      location,
      extra,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('worker_profiles').insertOne(newProfile);
    res.json({ ...newProfile, _id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getDb();
    
    const profile = await db.collection('worker_profiles').findOne({ user: new ObjectId(userId) });
    if (!profile) return res.status(404).json({ message: 'Not found' });
    
    // Manual populate
    const user = await db.collection('users').findOne(
      { _id: profile.user },
      { projection: { email: 1, full_name: 1, role: 1 } }
    );
    
    res.json({ ...profile, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;
    updates.updatedAt = new Date();
    
    const db = getDb();
    const result = await db.collection('worker_profiles').findOneAndUpdate(
      { user: new ObjectId(userId) },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    if (!result.value) return res.status(404).json({ message: 'Not found' });
    res.json(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
