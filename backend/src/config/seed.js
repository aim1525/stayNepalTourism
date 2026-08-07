const bcrypt = require('bcryptjs');
const { dbRun, dbGet, dbAll, initDB } = require('./db');

const seedDatabase = async (force = false) => {
  console.log('🌱 Initializing & Seeding StayNepal Database...');
  await initDB();

  // Check if database already has users to prevent wiping user data on server restart
  const userCheck = await dbGet('SELECT COUNT(*) as count FROM users');
  const userCount = userCheck ? parseInt(userCheck.count) : 0;

  if (userCount > 0 && !force && process.env.FORCE_SEED !== 'true') {
    console.log(`✅ StayNepal Database is active with ${userCount} users. Preserving all registered user data.`);
    return;
  }

  console.log('🔄 Seeding initial dataset...');
  // Clear existing tables when forced or on initial empty database
  await dbRun('TRUNCATE payments, reviews, bookings, homestays, users RESTART IDENTITY CASCADE;');

  // Passwords
  const defaultPassword = await bcrypt.hash('Password123!', 10);

  // 1. Seed Users (Admin, Hosts, Tourists)
  const users = [
    { name: 'Aim Admin', email: 'admin@staynepal.gov.np', role: 'admin', phone: '+977-9800000000' },
    { name: 'Karsang Gurung', email: 'host.karsang@staynepal.com', role: 'host', phone: '+977-9811111111' },
    { name: 'Pasang Sherpa', email: 'host.pasang@staynepal.com', role: 'host', phone: '+977-9822222222' },
    { name: 'Ram Bahadur Tharu', email: 'host.ram@staynepal.com', role: 'host', phone: '+977-9833333333' },
    { name: 'Sujata Shrestha', email: 'host.sujata@staynepal.com', role: 'host', phone: '+977-9844444444' },
    { name: 'Prem Magar', email: 'host.prem@staynepal.com', role: 'host', phone: '+977-9855555511' },
    { name: 'Bhakta Tamang', email: 'host.tamang@staynepal.com', role: 'host', phone: '+977-9866666622' },
    { name: 'John Doe (Tourist)', email: 'tourist@staynepal.com', role: 'tourist', phone: '+977-9855555555' },
    { name: 'Maya Lin (Tourist)', email: 'maya@staynepal.com', role: 'tourist', phone: '+977-9866666666' },
    { name: 'Aarav Sharma (Tourist)', email: 'aarav@staynepal.com', role: 'tourist', phone: '+977-9877777777' }
  ];

  for (const u of users) {
    await dbRun(
      'INSERT INTO users (name, email, password, role, phone) VALUES (?, ?, ?, ?, ?)',
      [u.name, u.email, defaultPassword, u.role, u.phone]
    );
  }

  const karsang = await dbGet('SELECT id FROM users WHERE email = ?', ['host.karsang@staynepal.com']);
  const pasang = await dbGet('SELECT id FROM users WHERE email = ?', ['host.pasang@staynepal.com']);
  const ram = await dbGet('SELECT id FROM users WHERE email = ?', ['host.ram@staynepal.com']);
  const sujata = await dbGet('SELECT id FROM users WHERE email = ?', ['host.sujata@staynepal.com']);
  const prem = await dbGet('SELECT id FROM users WHERE email = ?', ['host.prem@staynepal.com']);
  const tamang = await dbGet('SELECT id FROM users WHERE email = ?', ['host.tamang@staynepal.com']);
  const tourist = await dbGet('SELECT id FROM users WHERE email = ?', ['tourist@staynepal.com']);

  // 2. Seed 12 Homestays across Nepal with 100% Unique Image Sets
  const homestays = [
    {
      host_id: karsang.id,
      title_en: 'Ghandruk Traditional Gurung Homestay',
      title_ne: 'घान्द्रुक परम्परागत गुरुङ होमस्टे',
      description_en: 'Experience authentic Gurung hospitality with breathtaking views of Annapurna South and Machhapuchhre. Enjoy organic local cuisine, cultural Rodhi performance, and mountain trekking trails.',
      description_ne: 'अन्नपूर्ण दक्षिण र माछापुच्छ्रेको मनोरम दृश्यका साथ मौलिक गुरुङ आतिथ्यताको अनुभव लिनुहोस्। जैविक स्थानीय परिकार र सांस्कृतिक रोधीको आनन्द लिनुहोस्।',
      district: 'Kaski',
      village: 'Ghandruk',
      latitude: 28.3762,
      longitude: 83.8083,
      price_per_night: 1800,
      capacity: 4,
      cultural_tag: 'Gurung',
      amenities: JSON.stringify(['Hot Shower', 'Organic Food', 'Mountain View', 'Cultural Dance', 'WiFi']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: pasang.id,
      title_en: 'Namche Bazaar Sherpa Cultural Lodge',
      title_ne: 'नाम्चे बजार शेर्पा सांस्कृतिक लज',
      description_en: 'Heart of Khumbu region. High altitude Sherpa homestay featuring butter tea, tsampa, Everest view trails, and authentic Buddhist monastery walks.',
      description_ne: 'खुम्बु क्षेत्रको केन्द्रविन्दु। उच्च हिमाली शेर्पा होमस्टे, सुज्या, छ्याङ, र सगरमाथा दृश्य पदमार्ग।',
      district: 'Solukhumbu',
      village: 'Namche Bazaar',
      latitude: 27.8069,
      longitude: 86.7140,
      price_per_night: 2800,
      capacity: 3,
      cultural_tag: 'Sherpa',
      amenities: JSON.stringify(['Heated Blanket', 'Sherpa Butter Tea', 'Everest View', 'Fireplace', 'Guides']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: ram.id,
      title_en: 'Sauraha Tharu Eco Community Homestay',
      title_ne: 'सौराहा थारु इको सामुदायिक होमस्टे',
      description_en: 'Immerse in Tharu culture right on the edge of Chitwan National Park. Elephant safari, Tharu stick dance, and traditional fish curry.',
      description_ne: 'चितवन राष्ट्रिय निकुञ्जको किनारमा थारु संस्कृतिमा रमाउनुहोस्। हात्ती सफारी, थारु लाठी नाच र परम्परागत माछाको परिकार।',
      district: 'Chitwan',
      village: 'Sauraha',
      latitude: 27.5802,
      longitude: 84.4962,
      price_per_night: 1500,
      capacity: 5,
      cultural_tag: 'Tharu',
      amenities: JSON.stringify(['Jungle Safari', 'AC Rooms', 'Tharu Stick Dance', 'Garden', 'Bicycle Rental']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: sujata.id,
      title_en: 'Bhaktapur Newari Heritage House',
      title_ne: 'भक्तपुर नेवारी हेरिटेज हाउस',
      description_en: 'Live in a 200-year-old carved wooden brick house in historical Bhaktapur. Sample Samay Baji, Juju Dhau (king curd), and pottery making.',
      description_ne: 'ऐतिहासिक भक्तपुरमा २०० वर्ष पुरानो काठको कलात्मक घरमा बस्नुहोस्। समय बजी, जुजु धौ र माटोको भाँडा बनाउने कला सिकौँ।',
      district: 'Bhaktapur',
      village: 'Bhaktapur Durbar Square',
      latitude: 27.6710,
      longitude: 85.4298,
      price_per_night: 2200,
      capacity: 2,
      cultural_tag: 'Newari',
      amenities: JSON.stringify(['Heritage Architecture', 'Juju Dhau Tasting', 'Rooftop Terrace', 'WiFi']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: karsang.id,
      title_en: 'Marpha Apple Orchard Thakali Homestay',
      title_ne: 'मार्फा स्याउ बगान थकाली होमस्टे',
      description_en: 'Located in the stone village of Marpha, Mustang. Taste world-famous Thakali Thali, local apple brandy, and explore dry Himalayan valley cliffs.',
      description_ne: 'मुस्ताङको मार्फा ढुङ्गे गाउँमा अवस्थित। प्रसिद्ध थकाली थाली र स्थानीय स्याउको मदिराको स्वाद।',
      district: 'Mustang',
      village: 'Marpha',
      latitude: 28.7539,
      longitude: 83.6864,
      price_per_night: 2400,
      capacity: 4,
      cultural_tag: 'Thakali',
      amenities: JSON.stringify(['Thakali Thali', 'Apple Wine Tasting', 'Stone Architecture', 'Wifi']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: sujata.id,
      title_en: 'Kanyam Tea Estate Kirat/Rai Homestay',
      title_ne: 'कन्याम चिया बगान किरात/राई होमस्टे',
      description_en: 'Surrounded by lush green tea gardens in Ilam. Experience Kirat cultural music, fresh tea plucking, and serene eastern hills atmosphere.',
      description_ne: 'इलामको हरियो चिया बगानले घेरिएको। किरात सांस्कृतिक संगीत, चिया टिप्ने अनुभव र शान्त पूर्वी पहाड।',
      district: 'Ilam',
      village: 'Kanyam',
      latitude: 26.8617,
      longitude: 88.0601,
      price_per_night: 1600,
      capacity: 3,
      cultural_tag: 'Kirat',
      amenities: JSON.stringify(['Tea Plucking', 'Fresh Organic Milk', 'Mountain Sunrise View', 'Barbecue']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: tamang.id,
      title_en: 'Langtang Valley Tamang Heritage Home',
      title_ne: 'लाङटाङ उपत्यका तामाङ हेरिटेज होम',
      description_en: 'Surrounded by pristine Himalayan glaciers. Traditional Tamang stone house offering yak cheese tasting, butter lamps, and peaceful alpine solitude.',
      description_ne: 'लाङटाङ पदमार्गमा अवस्थित तामाङ होमस्टे। याकको छुर्पी, नौनी चिया र तामाङ सेलो नृत्य।',
      district: 'Rasuwa',
      village: 'Syabrubesi',
      latitude: 28.1633,
      longitude: 85.3411,
      price_per_night: 1900,
      capacity: 4,
      cultural_tag: 'Tamang',
      amenities: JSON.stringify(['Yak Cheese', 'Tamang Culture', 'Alpine View', 'Fireplace']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: sujata.id,
      title_en: 'Janakpur Mithila Art Heritage Lodge',
      title_ne: 'जनकपुर मिथिला कला हेरिटेज लज',
      description_en: 'Step into a colorful world of handmade Mithila paintings, Maithili traditional cuisine, Janaki temple spiritual walks, and warm southern plains hospitality.',
      description_ne: 'जनकपुरको मौलिक मिथिला चित्रकला, मैथिली खानपिन र जानकी मन्दिर दर्शनको सुअवसर।',
      district: 'Dhanusha',
      village: 'Janakpurdham',
      latitude: 26.7271,
      longitude: 85.9231,
      price_per_night: 1700,
      capacity: 5,
      cultural_tag: 'Mithila',
      amenities: JSON.stringify(['Mithila Painting Workshop', 'Maithili Cuisine', 'AC Rooms', 'Courtyard']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: prem.id,
      title_en: 'Tansen Palpa Hilltop Magar Homestay',
      title_ne: 'तानसेन पाल्पा डाँडागाउँ मगर होमस्टे',
      description_en: 'Overlooking Srinagar hill and Kali Gandaki river. Learn Palpali Dhaka fabric weaving, taste Batuk, and enjoy traditional Magar Maruni dance performance.',
      description_ne: 'श्रीनगर डाँडा र कालीगण्डकी नदीको मनोरम दृश्य। पाल्पाली ढाका बुनाई, बटुक र मरुनी नृत्य।',
      district: 'Palpa',
      village: 'Tansen',
      latitude: 27.8673,
      longitude: 83.5466,
      price_per_night: 1650,
      capacity: 4,
      cultural_tag: 'Magar',
      amenities: JSON.stringify(['Palpali Dhaka Weaving', 'Magar Maruni Dance', 'Organic Coffee', 'Rooftop View']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: karsang.id,
      title_en: 'Bandipur Ancient Slate Roof Village Lodge',
      title_ne: 'बन्दीपुर प्राचीन ढुङ्गे छाना गाउँ लज',
      description_en: 'Walk along vehicle-free cobblestone streets lined with 18th-century Newari architecture. Panoramic views of Marshyangdi valley and Trishuli river hills.',
      description_ne: '१८ औँ शताब्दीको नेवारी वास्तुकला र सवारी साधनरहित ढुङ्गे गल्ली। मर्स्याङ्दी उपत्यकाको भव्य दृश्य।',
      district: 'Tanahun',
      village: 'Bandipur',
      latitude: 27.9392,
      longitude: 84.4173,
      price_per_night: 2100,
      capacity: 3,
      cultural_tag: 'Newari',
      amenities: JSON.stringify(['Cobblestone Promenade', 'Newari Thali', 'View Tower Walk', 'WiFi']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: prem.id,
      title_en: 'Gorkha Palace View Gurung Heritage Homestay',
      title_ne: 'गोरखा दरबार दृश्य गुरुङ हेरिटेज होमस्टे',
      description_en: 'Located near historical Gorkha Durbar, birthplace of unified Nepal. Experience Gurung warrior history, organic millet dhido, and pine forest trails.',
      description_ne: 'ऐतिहासिक गोरखा दरबार नजिक। नेपाल एकीकरणको इतिहास, कोदोको ढिँडो र सल्लो घारी पदमार्ग।',
      district: 'Gorkha',
      village: 'Gorkha Bazaar',
      latitude: 28.0055,
      longitude: 84.6297,
      price_per_night: 1750,
      capacity: 4,
      cultural_tag: 'Gurung',
      amenities: JSON.stringify(['Gorkha Durbar Tour', 'Millet Dhido', 'Local Organic Honey', 'Garden View']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    },
    {
      host_id: tamang.id,
      title_en: 'Jiri Swiss Valley Alpine Sherpa Homestay',
      title_ne: 'जिरी स्विस उपत्यका शेर्पा होमस्टे',
      description_en: 'Known as the Switzerland of Nepal. Lush rolling meadows, fresh yak cheese dairy farm tours, and classic Everest base camp trekking gateway heritage.',
      description_ne: 'नेपालको स्विट्जरल्याण्ड भनेर चिनिने जिरी। हरियाली फाँट, याक चिज डेरी फार्म र पदयात्रा।',
      district: 'Dolakha',
      village: 'Jiri',
      latitude: 27.6333,
      longitude: 86.2333,
      price_per_night: 1950,
      capacity: 5,
      cultural_tag: 'Sherpa',
      amenities: JSON.stringify(['Yak Cheese Factory Tour', 'Horse Riding', 'Alpine Meadows', 'Fireplace']),
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1000&q=80'
      ]),
      is_verified: 1
    }
  ];

  for (const h of homestays) {
    await dbRun(
      `INSERT INTO homestays (
        host_id, title_en, title_ne, description_en, description_ne,
        district, village, latitude, longitude, price_per_night,
        capacity, cultural_tag, amenities, images, is_verified
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        h.host_id, h.title_en, h.title_ne, h.description_en, h.description_ne,
        h.district, h.village, h.latitude, h.longitude, h.price_per_night,
        h.capacity, h.cultural_tag, h.amenities, h.images, h.is_verified
      ]
    );
  }

  const homestay1 = await dbGet('SELECT id FROM homestays WHERE district = ?', ['Kaski']);
  const homestay2 = await dbGet('SELECT id FROM homestays WHERE district = ?', ['Bhaktapur']);
  const homestay3 = await dbGet('SELECT id FROM homestays WHERE district = ?', ['Solukhumbu']);

  // 3. Seed Bookings
  await dbRun(
    `INSERT INTO bookings (homestay_id, tourist_id, check_in, check_out, guests, total_amount, status)
     VALUES (?, ?, '2026-08-10', '2026-08-12', 2, 3600, 'confirmed')`,
    [homestay1.id, tourist.id]
  );
  await dbRun(
    `INSERT INTO bookings (homestay_id, tourist_id, check_in, check_out, guests, total_amount, status)
     VALUES (?, ?, '2026-08-15', '2026-08-17', 2, 4400, 'completed')`,
    [homestay2.id, tourist.id]
  );
  await dbRun(
    `INSERT INTO bookings (homestay_id, tourist_id, check_in, check_out, guests, total_amount, status)
     VALUES (?, ?, '2026-09-01', '2026-09-04', 3, 8400, 'confirmed')`,
    [homestay3.id, tourist.id]
  );

  const booking2 = await dbGet('SELECT id FROM bookings WHERE status = ?', ['completed']);

  // 4. Seed Review
  await dbRun(
    `INSERT INTO reviews (booking_id, homestay_id, tourist_id, rating, comment, cultural_experience_rating)
     VALUES (?, ?, ?, 5, 'Exceptional experience! The Newari Samay Baji food and warm wooden architecture was unforgettable.', 5)`,
    [booking2.id, homestay2.id, tourist.id]
  );

  // 5. Seed Payment (Adapter demo)
  await dbRun(
    `INSERT INTO payments (booking_id, gateway, transaction_id, amount, status, gateway_response)
     VALUES (?, 'esewa', 'ESEWA-TXN-984392', 4400, 'success', '{"refId":"000452","status":"COMPLETE"}')`,
    [booking2.id]
  );

  console.log('✅ StayNepal Database Seeded Successfully with 12 Unique Homestays!');
};

if (require.main === module) {
  seedDatabase(true).catch((err) => {
    console.error('❌ Seeding Failed:', err);
  });
}

module.exports = seedDatabase;
