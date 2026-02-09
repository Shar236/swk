import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
}, { timestamps: true });

export default mongoose.model('Service', ServiceSchema);
