import { getDb } from '../config/db.js';
import { ObjectId } from 'mongodb';

const toObjectId = (id) => {
  try {
    return id ? new ObjectId(id) : null;
  } catch (e) {
    return null;
  }
};

const buildPopulatePipeline = () => ([
  { $lookup: { from: 'services', localField: 'service', foreignField: '_id', as: 'service' } },
  { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'customers', localField: 'customer', foreignField: '_id', as: 'customer' } },
  { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
  { $lookup: { from: 'workerprofiles', localField: 'worker', foreignField: '_id', as: 'worker_profile' } },
  { $unwind: { path: '$worker_profile', preserveNullAndEmptyArrays: true } },
]);

export const createBooking = async (req, res) => {
  try {
    const { serviceId, customerId, workerId, scheduled_at, address, city } = req.body;
    const db = getDb();
    const doc = {
      service: toObjectId(serviceId),
      customer: toObjectId(customerId),
      worker: toObjectId(workerId),
      status: 'pending',
      scheduled_at: scheduled_at ? new Date(scheduled_at) : null,
      address: address || null,
      city: city || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bookings').insertOne(doc);
    const insertedId = result.insertedId;

    // Return the populated booking
    const pipeline = [
      { $match: { _id: insertedId } },
      ...buildPopulatePipeline(),
    ];

    const booking = await db.collection('bookings').aggregate(pipeline).next();
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getByWorkerId = async (req, res) => {
  try {
    const { workerId } = req.params;
    const db = getDb();
    const workerObjId = toObjectId(workerId);

    const match = workerObjId ? { worker: workerObjId } : { worker: workerId };

    const pipeline = [
      { $match: match },
      ...buildPopulatePipeline(),
      { $sort: { createdAt: -1 } },
    ];

    const cursor = db.collection('bookings').aggregate(pipeline);
    const results = await cursor.toArray();
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listBookings = async (req, res) => {
  try {
    const { status, worker_id, worker_user_id, limit, is_worker_null } = req.query;
    const db = getDb();
    const q = {};
    if (status) q.status = status;
    if (worker_id) {
      const wId = toObjectId(worker_id);
      q.worker = wId || worker_id;
    }
    if (is_worker_null === '1') q.worker = null;

    if (worker_user_id) {
      const wp = await db.collection('workerprofiles').findOne({ user: toObjectId(worker_user_id) });
      if (wp) q.worker = wp._id;
      else q.worker = null;
    }

    const pipeline = [
      { $match: q },
      ...buildPopulatePipeline(),
      { $sort: { createdAt: -1 } },
    ];

    if (limit) pipeline.push({ $limit: parseInt(limit, 10) });

    const bookings = await db.collection('bookings').aggregate(pipeline).toArray();
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const objId = toObjectId(id);
    if (!objId) return res.status(400).json({ message: 'Invalid id' });

    const pipeline = [
      { $match: { _id: objId } },
      ...buildPopulatePipeline(),
    ];

    const booking = await db.collection('bookings').aggregate(pipeline).next();
    if (!booking) return res.status(404).json({ message: 'Not found' });
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date() };
    const db = getDb();
    const objId = toObjectId(id);
    if (!objId) return res.status(400).json({ message: 'Invalid id' });

    // Convert any id fields to ObjectId
    if (updates.service) updates.service = toObjectId(updates.service) || updates.service;
    if (updates.customer) updates.customer = toObjectId(updates.customer) || updates.customer;
    if (updates.worker) updates.worker = toObjectId(updates.worker) || updates.worker;

    const result = await db.collection('bookings').updateOne({ _id: objId }, { $set: updates });
    if (result.matchedCount === 0) return res.status(404).json({ message: 'Not found' });

    const pipeline = [
      { $match: { _id: objId } },
      ...buildPopulatePipeline(),
    ];

    const updated = await db.collection('bookings').aggregate(pipeline).next();
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export alias for clarity/compatibility
export { getById as getBookingById };
