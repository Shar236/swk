import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkerProfile' },
  status: { type: String, enum: ['pending','matched','accepted','in_progress','completed','cancelled'], default: 'pending' },
  scheduled_at: { type: Date },
  address: { type: String },
  city: { type: String },
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);
