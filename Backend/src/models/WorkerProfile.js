import mongoose from 'mongoose';

const WorkerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  bio: { type: String },
  location: { type: String },
  extra: { type: Object },
}, { timestamps: true });

export default mongoose.model('WorkerProfile', WorkerProfileSchema);
