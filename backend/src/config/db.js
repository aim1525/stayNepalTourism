const { Pool, Client } = require('pg');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });

const targetDb = process.env.PGDATABASE || 'staynepal';
const pgUser = process.env.PGUSER || 'postgres';
const pgPassword = process.env.PGPASSWORD || 'postgres1';
const pgHost = process.env.PGHOST || 'localhost';
const pgPort = process.env.PGPORT || 5432;

const connectionString = process.env.DATABASE_URL || 
  `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${targetDb}`;

const pool = new Pool({
  connectionString,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

/**
 * Ensures target PostgreSQL database exists before creating tables
 */
const ensureDatabaseExists = async () => {
  const adminClient = new Client({
    host: pgHost,
    port: pgPort,
    user: pgUser,
    password: pgPassword,
    database: 'postgres'
  });

  try {
    await adminClient.connect();
    const res = await adminClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [targetDb]);
    if (res.rowCount === 0) {
      await adminClient.query(`CREATE DATABASE "${targetDb}";`);
      console.log(`✅ Created PostgreSQL database '${targetDb}'`);
    }
  } catch (err) {
    // Admin check warning (database may already exist or restricted user)
  } finally {
    await adminClient.end().catch(() => {});
  }
};

/**
 * Helper function to convert SQLite ? parameter placeholders to PostgreSQL $1, $2, $3 placeholders
 */
const convertSqlPlaceholders = (sql) => {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
};

/**
 * Executes an INSERT / UPDATE / DELETE command and returns lastID and changes count
 */
const dbRun = async (sql, params = []) => {
  let pgSql = convertSqlPlaceholders(sql.trim());

  // Automatically append RETURNING id for INSERT queries if not already present
  if (pgSql.toUpperCase().startsWith('INSERT') && !pgSql.toUpperCase().includes('RETURNING')) {
    pgSql += ' RETURNING id';
  }

  const result = await pool.query(pgSql, params);
  const lastID = result.rows && result.rows.length > 0 && result.rows[0].id ? Number(result.rows[0].id) : 0;
  return {
    lastID,
    changes: result.rowCount
  };
};

/**
 * Executes a query and returns all matching rows
 */
const dbAll = async (sql, params = []) => {
  const pgSql = convertSqlPlaceholders(sql);
  const result = await pool.query(pgSql, params);
  return result.rows;
};

/**
 * Executes a query and returns the first matching row or null
 */
const dbGet = async (sql, params = []) => {
  const pgSql = convertSqlPlaceholders(sql);
  const result = await pool.query(pgSql, params);
  return result.rows[0] || null;
};

/**
 * Haversine Distance Helper to simulate PostGIS ST_Distance / ST_DWithin across Nepal 77 districts
 */
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 100) / 100; // km
};

/**
 * Initialize PostgreSQL Schema DDL
 */
const initDB = async () => {
  await ensureDatabaseExists();

  // Table 1: users (Tourist, Host, Admin)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) CHECK(role IN ('tourist', 'host', 'admin')) NOT NULL DEFAULT 'tourist',
      phone VARCHAR(50),
      preferred_language VARCHAR(10) DEFAULT 'en',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table 2: homestays (with PostGIS simulation latitude/longitude & district)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS homestays (
      id SERIAL PRIMARY KEY,
      host_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title_en VARCHAR(255) NOT NULL,
      title_ne VARCHAR(255) NOT NULL,
      description_en TEXT,
      description_ne TEXT,
      district VARCHAR(100) NOT NULL,
      village VARCHAR(100) NOT NULL,
      latitude DOUBLE PRECISION NOT NULL,
      longitude DOUBLE PRECISION NOT NULL,
      price_per_night NUMERIC(10, 2) NOT NULL,
      capacity INTEGER NOT NULL DEFAULT 2,
      cultural_tag VARCHAR(100) NOT NULL,
      amenities TEXT,
      images TEXT,
      is_verified INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table 3: bookings
  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      homestay_id INTEGER NOT NULL REFERENCES homestays(id) ON DELETE CASCADE,
      tourist_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guests INTEGER NOT NULL DEFAULT 1,
      total_amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(50) CHECK(status IN ('pending', 'confirmed', 'cancelled', 'completed')) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table 4: reviews
  await pool.query(`
    CREATE TABLE IF NOT EXISTS reviews (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
      homestay_id INTEGER NOT NULL REFERENCES homestays(id) ON DELETE CASCADE,
      tourist_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
      comment TEXT,
      cultural_experience_rating INTEGER CHECK(cultural_experience_rating BETWEEN 1 AND 5) DEFAULT 5,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Table 5: payments (eSewa, Khalti, FonePay)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      gateway VARCHAR(50) CHECK(gateway IN ('esewa', 'khalti', 'fonepay')) NOT NULL,
      transaction_id VARCHAR(255) UNIQUE NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      status VARCHAR(50) CHECK(status IN ('initiated', 'success', 'failed', 'refunded')) DEFAULT 'initiated',
      gateway_response TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

module.exports = {
  db: pool,
  pool,
  dbRun,
  dbAll,
  dbGet,
  initDB,
  calculateHaversineDistance
};
