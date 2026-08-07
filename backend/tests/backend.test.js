const request = require('supertest');
const app = require('../src/server');
const { initDB, dbRun, pool } = require('../src/config/db');

let touristToken, hostToken, adminToken;
let createdHomestayId, createdBookingId;

beforeAll(async () => {
  process.env.NODE_ENV = 'test';
  await initDB();
  await dbRun('TRUNCATE payments, reviews, bookings, homestays, users RESTART IDENTITY CASCADE;');
});

afterAll(async () => {
  if (pool) {
    await pool.end();
  }
});

describe('StayNepal Full-Stack Backend Integration & Unit Tests (FR-01 to FR-10)', () => {
  // FR-01: User registration and login with JWT
  test('FR-01: Should register a Tourist, Host, and Admin successfully', async () => {
    const resTourist = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Tourist', email: 'tourist.test@nepal.com', password: 'Password123!', role: 'tourist' });
    expect(resTourist.statusCode).toEqual(201);
    expect(resTourist.body.token).toBeDefined();
    touristToken = resTourist.body.token;

    const resHost = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Host', email: 'host.test@nepal.com', password: 'Password123!', role: 'host' });
    expect(resHost.statusCode).toEqual(201);
    hostToken = resHost.body.token;

    const resAdmin = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test Admin', email: 'admin.test@nepal.com', password: 'Password123!', role: 'admin' });
    expect(resAdmin.statusCode).toEqual(201);
    adminToken = resAdmin.body.token;
  });

  test('FR-01: Should login registered user and return valid JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'tourist.test@nepal.com', password: 'Password123!' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toEqual('tourist');
  });

  // FR-04: Homestay listing creation by hosts
  test('FR-04: Should allow Host to create homestay listing with bilingual fields', async () => {
    const res = await request(app)
      .post('/api/homestays')
      .set('Authorization', `Bearer ${hostToken}`)
      .send({
        title_en: 'Bandipur Newari Hilltop Homestay',
        title_ne: 'बन्दीपुर नेवारी पहाडी होमस्टे',
        description_en: 'Serene mountain stay in Bandipur Tanahun district',
        district: 'Tanahun',
        village: 'Bandipur',
        latitude: 27.9392,
        longitude: 84.4172,
        price_per_night: 2000,
        capacity: 3,
        cultural_tag: 'Newari',
        amenities: ['Hot Shower', 'Cultural Meal'],
        images: ['https://example.com/bandipur.jpg']
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.id).toBeDefined();
    createdHomestayId = res.body.id;
  });

  // FR-09: Admin verification
  test('FR-09: Should allow Admin to verify homestay listing', async () => {
    const res = await request(app)
      .patch(`/api/homestays/${createdHomestayId}/verify`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });

  // FR-02: Search & Filter
  test('FR-02: Should filter homestays by district and price range', async () => {
    const res = await request(app)
      .get('/api/homestays?district=Tanahun&max_price=2500');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].district).toEqual('Tanahun');
  });

  // FR-05: Booking System & Double Booking Prevention
  test('FR-05: Should allow Tourist to book a homestay', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        homestay_id: createdHomestayId,
        check_in: '2026-09-01',
        check_out: '2026-09-03',
        guests: 2
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.booking.status).toEqual('pending');
    createdBookingId = res.body.booking.id;
  });

  test('FR-05: Should PREVENT double-booking for overlapping dates', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        homestay_id: createdHomestayId,
        check_in: '2026-09-02',
        check_out: '2026-09-04',
        guests: 1
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toContain('Double-Booking Prevented');
  });

  // FR-06: Payment Initiation via eSewa & Khalti Adapters
  test('FR-06: Should initiate payment via eSewa Sandbox Adapter', async () => {
    const res = await request(app)
      .post('/api/payments/initiate')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        booking_id: createdBookingId,
        gateway: 'esewa'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.payment.gateway).toEqual('esewa');
  });

  test('FR-06: Should verify payment and confirm booking', async () => {
    const res = await request(app)
      .post('/api/payments/verify')
      .send({
        gateway: 'esewa',
        pid: 'ESEWA-STAYNEPAL-1',
        refId: '000123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.verification.success).toBe(true);
  });

  // FR-07: Review & Rating System
  test('FR-07: Should allow Tourist to submit star rating and review after stay', async () => {
    const res = await request(app)
      .post('/api/reviews')
      .set('Authorization', `Bearer ${touristToken}`)
      .send({
        booking_id: createdBookingId,
        rating: 5,
        cultural_experience_rating: 5,
        comment: 'Warm Bandipur local hospitality and wonderful food!'
      });
    expect(res.statusCode).toEqual(201);
  });

  // FR-03: AI Recommendation System Endpoint
  test('FR-03: Should fetch AI recommended homestays with match scores', async () => {
    const res = await request(app)
      .get('/api/ai/recommendations?model=ncf&top_n=5');
    expect(res.statusCode).toEqual(200);
    expect(res.body.recommendations.length).toBeGreaterThan(0);
  });
});
