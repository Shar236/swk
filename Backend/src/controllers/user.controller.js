import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Prevent updating password via this route
    if (updates.password) delete updates.password;
    
    // Also update updatedAt
    updates.updatedAt = new Date();

    const db = getDb();
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: 'after', projection: { password: 0 } }
    );
    
    if (!result.value) return res.status(404).json({ message: 'Not found' });
    res.json(result.value);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
    
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
