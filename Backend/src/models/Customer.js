import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  full_name: { type: String },
  phone: { type: String },
  email: { type: String },
}, { timestamps: true });

export default mongoose.model('Customer', CustomerSchema);
