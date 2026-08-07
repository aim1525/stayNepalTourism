const { dbRun, dbAll, dbGet, calculateHaversineDistance } = require('../config/db');

const getHomestays = async (req, res) => {
  try {
    const { district, min_price, max_price, cultural_tag, search, lat, lon } = req.query;

    let query = 'SELECT h.*, u.name as host_name, u.phone as host_phone FROM homestays h JOIN users u ON h.host_id = u.id WHERE 1=1';
    const params = [];

    if (district) {
      query += ' AND LOWER(h.district) LIKE ?';
      params.push(`%${district.toLowerCase()}%`);
    }

    if (min_price) {
      query += ' AND h.price_per_night >= ?';
      params.push(Number(min_price));
    }

    if (max_price) {
      query += ' AND h.price_per_night <= ?';
      params.push(Number(max_price));
    }

    if (cultural_tag) {
      query += ' AND LOWER(h.cultural_tag) = ?';
      params.push(cultural_tag.toLowerCase());
    }

    if (search) {
      query += ' AND (LOWER(h.title_en) LIKE ? OR LOWER(h.title_ne) LIKE ? OR LOWER(h.village) LIKE ?)';
      const s = `%${search.toLowerCase()}%`;
      params.push(s, s, s);
    }

    query += ' ORDER BY h.is_verified DESC, h.created_at DESC';

    let homestays = await dbAll(query, params);

    // If user provided coordinates (PostGIS distance computation)
    if (lat && lon) {
      const userLat = parseFloat(lat);
      const userLon = parseFloat(lon);
      homestays = homestays.map(h => {
        const distanceKm = calculateHaversineDistance(userLat, userLon, h.latitude, h.longitude);
        return { ...h, distance_km: distanceKm };
      }).sort((a, b) => a.distance_km - b.distance_km);
    }

    // Parse JSON fields safely
    const formatted = homestays.map(h => ({
      ...h,
      amenities: typeof h.amenities === 'string' ? JSON.parse(h.amenities || '[]') : h.amenities,
      images: typeof h.images === 'string' ? JSON.parse(h.images || '[]') : h.images
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch homestays: ' + error.message });
  }
};

const getHomestayById = async (req, res) => {
  try {
    const homestay = await dbGet(
      'SELECT h.*, u.name as host_name, u.email as host_email, u.phone as host_phone FROM homestays h JOIN users u ON h.host_id = u.id WHERE h.id = ?',
      [req.params.id]
    );

    if (!homestay) {
      return res.status(404).json({ error: 'Homestay not found' });
    }

    // Fetch reviews
    const reviews = await dbAll(
      'SELECT r.*, u.name as tourist_name FROM reviews r JOIN users u ON r.tourist_id = u.id WHERE r.homestay_id = ? ORDER BY r.created_at DESC',
      [homestay.id]
    );

    // Calculate rating stats
    const avgRating = reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : 5.0;

    res.json({
      ...homestay,
      amenities: JSON.parse(homestay.amenities || '[]'),
      images: JSON.parse(homestay.images || '[]'),
      average_rating: parseFloat(avgRating),
      reviews_count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createHomestay = async (req, res) => {
  try {
    const {
      title_en, title_ne, description_en, description_ne,
      district, village, latitude, longitude, price_per_night,
      capacity, cultural_tag, amenities, images
    } = req.body;

    if (!title_en || !district || !village || !price_per_night) {
      return res.status(400).json({ error: 'Title, district, village, and price are required' });
    }

    const host_id = req.user.id;
    const is_verified = req.user.role === 'admin' ? 1 : 0; // Host listings subject to admin verification

    const amenitiesStr = Array.isArray(amenities) ? JSON.stringify(amenities) : (amenities || '[]');
    const imagesStr = Array.isArray(images) ? JSON.stringify(images) : (images || '[]');

    const result = await dbRun(
      `INSERT INTO homestays (
        host_id, title_en, title_ne, description_en, description_ne,
        district, village, latitude, longitude, price_per_night,
        capacity, cultural_tag, amenities, images, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        host_id, title_en, title_ne || title_en, description_en || '', description_ne || description_en || '',
        district, village, latitude || 27.7172, longitude || 85.3240, price_per_night,
        capacity || 2, cultural_tag || 'Traditional', amenitiesStr, imagesStr, is_verified
      ]
    );

    res.status(201).json({
      message: 'Homestay created successfully (Pending verification)',
      id: result.lastID
    });
  } catch (error) {
    res.status(500).json({ error: 'Creation failed: ' + error.message });
  }
};

const verifyHomestay = async (req, res) => {
  try {
    const { id } = req.params;
    await dbRun('UPDATE homestays SET is_verified = 1 WHERE id = ?', [id]);
    res.json({ message: `Homestay ID ${id} verified successfully by Admin.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getHomestays,
  getHomestayById,
  createHomestay,
  verifyHomestay
};
