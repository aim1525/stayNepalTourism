const { dbRun, dbGet, dbAll } = require('../config/db');

const createReview = async (req, res) => {
  try {
    const { booking_id, rating, comment, cultural_experience_rating = 5 } = req.body;
    const tourist_id = req.user.id;

    if (!booking_id || !rating) {
      return res.status(400).json({ error: 'Booking ID and star rating (1-5) are required' });
    }

    const booking = await dbGet('SELECT * FROM bookings WHERE id = ? AND tourist_id = ?', [booking_id, tourist_id]);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or does not belong to you' });
    }

    const existingReview = await dbGet('SELECT id FROM reviews WHERE booking_id = ?', [booking_id]);
    if (existingReview) {
      return res.status(400).json({ error: 'A review has already been submitted for this booking' });
    }

    const result = await dbRun(
      `INSERT INTO reviews (booking_id, homestay_id, tourist_id, rating, comment, cultural_experience_rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [booking_id, booking.homestay_id, tourist_id, rating, comment || '', cultural_experience_rating]
    );

    res.status(201).json({
      message: 'Review submitted successfully. Thank you for rating your cultural experience!',
      id: result.lastID
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHomestayReviews = async (req, res) => {
  try {
    const { homestayId } = req.params;
    const reviews = await dbAll(
      'SELECT r.*, u.name as tourist_name FROM reviews r JOIN users u ON r.tourist_id = u.id WHERE r.homestay_id = ? ORDER BY r.created_at DESC',
      [homestayId]
    );
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createReview, getHomestayReviews };
