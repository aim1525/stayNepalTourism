const { dbRun, dbAll, dbGet } = require('../config/db');

const createBooking = async (req, res) => {
  try {
    const { homestay_id, check_in, check_out, guests = 1 } = req.body;
    const tourist_id = req.user.id;

    if (!homestay_id || !check_in || !check_out) {
      return res.status(400).json({ error: 'Homestay ID, check-in, and check-out dates are required' });
    }

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // 1. Verify homestay exists & capacity
    const homestay = await dbGet('SELECT * FROM homestays WHERE id = ?', [homestay_id]);
    if (!homestay) {
      return res.status(404).json({ error: 'Homestay not found' });
    }

    if (guests > homestay.capacity) {
      return res.status(400).json({ error: `Guest count (${guests}) exceeds homestay maximum capacity (${homestay.capacity})` });
    }

    // 2. FR-05 Double Booking Prevention Logic:
    // Check for any existing active booking overlapping with selected check_in and check_out
    const existingConflict = await dbGet(
      `SELECT id FROM bookings
       WHERE homestay_id = ?
       AND status IN ('pending', 'confirmed')
       AND (
         (check_in <= ? AND check_out > ?) OR
         (check_in < ? AND check_out >= ?) OR
         (? <= check_in AND ? >= check_out)
       )`,
      [homestay_id, check_in, check_in, check_out, check_out, check_in, check_out]
    );

    if (existingConflict) {
      return res.status(409).json({
        error: 'Double-Booking Prevented: The homestay is already reserved for the selected dates.',
        conflict_booking_id: existingConflict.id
      });
    }

    // 3. Calculate total price
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const total_amount = nights * homestay.price_per_night;

    const result = await dbRun(
      `INSERT INTO bookings (homestay_id, tourist_id, check_in, check_out, guests, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [homestay_id, tourist_id, check_in, check_out, guests, total_amount]
    );

    res.status(201).json({
      message: 'Booking request created successfully',
      booking: {
        id: result.lastID,
        homestay_id,
        homestay_title: homestay.title_en,
        tourist_id,
        check_in,
        check_out,
        nights,
        guests,
        total_amount,
        status: 'pending'
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Booking creation failed: ' + error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = '';
    let params = [];

    if (role === 'tourist') {
      query = `SELECT b.*, h.title_en as homestay_title, h.district, h.village, h.images, u.name as host_name
               FROM bookings b
               JOIN homestays h ON b.homestay_id = h.id
               JOIN users u ON h.host_id = u.id
               WHERE b.tourist_id = ?
               ORDER BY b.created_at DESC`;
      params = [id];
    } else if (role === 'host') {
      query = `SELECT b.*, h.title_en as homestay_title, u.name as tourist_name, u.email as tourist_email, u.phone as tourist_phone
               FROM bookings b
               JOIN homestays h ON b.homestay_id = h.id
               JOIN users u ON b.tourist_id = u.id
               WHERE h.host_id = ?
               ORDER BY b.created_at DESC`;
      params = [id];
    } else {
      // Admin
      query = `SELECT b.*, h.title_en as homestay_title, u.name as tourist_name, host.name as host_name
               FROM bookings b
               JOIN homestays h ON b.homestay_id = h.id
               JOIN users u ON b.tourist_id = u.id
               JOIN users host ON h.host_id = host.id
               ORDER BY b.created_at DESC`;
      params = [];
    }

    const bookings = await dbAll(query, params);
    const formatted = bookings.map(b => ({
      ...b,
      images: b.images ? JSON.parse(b.images || '[]') : []
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'confirmed', 'cancelled', 'completed'

    if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    await dbRun('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: `Booking ID ${id} status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getUserBookings, updateBookingStatus };
