import express from 'express';
import { createBooking, listBookings, updateBooking, getByWorkerId, getById } from '../controllers/booking.controller.js';

const router = express.Router();

// List bookings
router.get('/', listBookings);

// Create a new booking
router.post('/', createBooking);

// Update an existing booking
router.patch('/:id', updateBooking);

// Get bookings for a specific worker profile
router.get('/worker/:workerId', getByWorkerId);

// Get a single booking by id
router.get('/:id', getById);

export default router;
