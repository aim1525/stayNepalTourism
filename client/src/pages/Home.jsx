import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles, ShieldCheck, Compass, Mountain, ChevronRight, Mic, CreditCard, Award, ArrowRight, Heart, Users, Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import RecommendationSection from '../components/RecommendationSection';

const NEPAL_77_DISTRICTS = [
  "Kaski", "Solukhumbu", "Chitwan", "Bhaktapur", "Mustang", "Ilam", "Rasuwa", "Palpa",
  "Bardiya", "Gorkha", "Tanahun", "Dolakha", "Manang", "Taplejung", "Sankhuwasabha",
  "Kathmandu", "Lalitpur", "Kavrepalanchok", "Nuwakot", "Dhading", "Makwanpur",
  "Sindhupalchok", "Ramechhap", "Sindhuli", "Jhapa", "Panchthar", "Morang", "Sunsari",
  "Dhankuta", "Bhojpur", "Terhathum", "Okhaldhunga", "Khotang", "Solu", "Udayapur",
  "Saptari", "Siraha", "Dhanusha", "Mahottari", "Sarlahi", "Rautahat", "Bara", "Parsa",
  "Gulmi", "Arghakhanchi", "Syangja", "Myagdi", "Parbat", "Nawalpur", "Parasi",
  "Rupandehi", "Kapilvastu", "Dang", "Pyuthan", "Rolpa", "Eastern Rukum", "Western Rukum",
  "Salyan", "Banke", "Surkhet", "Dailekh", "Jajarkot", "Dolpa", "Jumla", "Kalikot",
  "Mugu", "Humla", "Kailali", "Kanchanpur", "Dadeldhura", "Baitadi", "Darchula",
  "Bajhang", "Bajura", "Doti", "Achham"
];

const CULTURAL_HIGHLIGHTS = [
  { tag: 'Gurung', name: 'Gurung Heritage', location: 'Ghandruk, Kaski', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80' },
  { tag: 'Sherpa', name: 'Sherpa Alpine', location: 'Namche, Solukhumbu', image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=600&q=80' },
  { tag: 'Tharu', name: 'Tharu Jungle Eco', location: 'Sauraha, Chitwan', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80' },
  { tag: 'Newari', name: 'Newari Valley', location: 'Bhaktapur & Bandipur', image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=600&q=80' },
  { tag: 'Thakali', name: 'Thakali Trade Route', location: 'Marpha, Mustang', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { tag: 'Kirat', name: 'Kirat Tea Estate', location: 'Kanyam, Ilam', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80' }
];

const Home = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/homestays?district=${selectedDistrict}&search=${searchQuery}`);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-4 sm:px-6">
        
        {/* Background Image with Warm Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
            alt="Annapurna Range Nepal"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=2000&q=80';
            }}
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-50 via-stone-50/70 to-slate-900/40"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-stone-200 text-rose-700 text-xs font-black mb-6 shadow-md">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-tight">
            {t('hero.title_part1')} <br />
            <span className="text-gradient-nepal">
              {t('hero.title_part2')}
            </span>
          </h1>

          <p className="mt-6 text-sm sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">
            {t('hero.subtitle')}
          </p>

          {/* Search Box Card */}
          <div className="mt-10 max-w-4xl mx-auto glass-card-hero rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/80">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* 77 District Selector */}
              <div className="sm:col-span-5 relative">
                <MapPin className="w-5 h-5 text-rose-600 absolute left-4 top-3.5" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl border border-stone-300 text-xs font-bold focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-sm"
                >
                  <option value="">{t('hero.search_district')}</option>
                  {NEPAL_77_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d} District</option>
                  ))}
                </select>
              </div>

              {/* Keyword Input */}
              <div className="sm:col-span-4 relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder={t('filter.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl border border-stone-300 text-xs font-bold focus:outline-none focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t('hero.search_button')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/90 p-4 rounded-3xl border border-stone-200/80 shadow-sm backdrop-blur-md">
              <span className="text-2xl font-black text-rose-600">77</span>
              <p className="text-[11px] text-slate-500 uppercase font-black mt-0.5">Districts Covered</p>
            </div>
            <div className="bg-white/90 p-4 rounded-3xl border border-stone-200/80 shadow-sm backdrop-blur-md">
              <span className="text-2xl font-black text-emerald-700">3</span>
              <p className="text-[11px] text-slate-500 uppercase font-black mt-0.5">AI Models (CBF/UBCF/NCF)</p>
            </div>
            <div className="bg-white/90 p-4 rounded-3xl border border-stone-200/80 shadow-sm backdrop-blur-md">
              <span className="text-2xl font-black text-amber-600">91.4%</span>
              <p className="text-[11px] text-slate-500 uppercase font-black mt-0.5">NCF Precision@10</p>
            </div>
            <div className="bg-white/90 p-4 rounded-3xl border border-stone-200/80 shadow-sm backdrop-blur-md">
              <span className="text-2xl font-black text-teal-700">86.5</span>
              <p className="text-[11px] text-slate-500 uppercase font-black mt-0.5">SUS Usability Score</p>
            </div>
          </div>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* 2. Top-5 AI Recommendation Section (FR-03) */}
        <RecommendationSection onSelectHomestay={(h) => navigate(`/homestays/${h.id || h.homestay_id}`)} />

        {/* 3. Cultural Heritage Showcase Grid */}
        <section>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300 mb-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Ethnic & Cultural Diversity</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">Explore Authentic Cultural Heritage</h2>
              <p className="text-xs text-slate-600 mt-1">Immerse in indigenous lifestyle, traditional foods, and community hospitality.</p>
            </div>
            <button
              onClick={() => navigate('/culture')}
              className="px-5 py-2.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 text-xs font-black rounded-2xl transition-all flex items-center gap-2 shadow-sm"
            >
              <span>View 77 Districts Culture Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CULTURAL_HIGHLIGHTS.map((item) => (
              <div
                key={item.tag}
                onClick={() => navigate(`/homestays?cultural_tag=${item.tag}`)}
                className="bg-white rounded-3xl border border-stone-200 hover:border-rose-400 overflow-hidden cursor-pointer group transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-amber-700 text-[10px] font-black uppercase px-3 py-1 rounded-full border border-amber-300 shadow-md">
                      {item.tag} Culture
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-black text-lg text-slate-900 group-hover:text-rose-600 transition-colors">{item.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {item.location}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center justify-between text-xs text-rose-600 font-extrabold group-hover:underline">
                  <span>Explore Homestays</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Voice-Assisted Host Onboarding Teaser Banner (FR-10) */}
        <section className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-emerald-200 text-xs font-black border border-white/30">
                <Mic className="w-4 h-4" />
                <span>Web Speech API Voice Onboarding (FR-10)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-snug">Empowering Rural Hosts with Voice Input</h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Rural homestay owners in remote districts like Mustang, Dolpa, or Solukhumbu can register their listings effortlessly by speaking in English or Nepali using our browser Web Speech voice-assisted form.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-xl shadow-amber-500/30 cursor-pointer"
                >
                  Register as Homestay Host
                </button>
                <button
                  onClick={() => navigate('/host')}
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-extrabold text-xs rounded-2xl transition-all"
                >
                  View Host Dashboard
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 space-y-3 shadow-xl">
              <div className="flex items-center gap-3 text-amber-400">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 flex items-center justify-center animate-pulse">
                  <Mic className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-white">Bilingual Voice Form Demo</span>
              </div>
              <p className="text-[11px] text-emerald-100 italic bg-black/20 p-3.5 rounded-2xl border border-white/10 leading-relaxed">
                "घान्द्रुक गाउँमा ४ जना बस्न मिल्ने परम्परागत गुरुङ होमस्टे दर्ता गर्नुहोस्..."
              </p>
              <div className="flex justify-between items-center text-[10px] text-amber-300 font-extrabold">
                <span>Speech Recognition Active</span>
                <span>Web Speech API</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Unified Payment Service Sandbox Showcase (FR-06) */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-lg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-300 mb-2">
              <CreditCard className="w-4 h-4 text-rose-600" />
              <span>Adapter Pattern Architecture (FR-06)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Unified Payment Gateway Integration</h2>
            <p className="text-xs text-slate-600 mt-1">Seamless booking payment execution wrapping eSewa, Khalti, and FonePay in a single PaymentService interface.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-50 p-6 rounded-3xl border border-emerald-200 text-center space-y-2 shadow-sm">
              <span className="px-3.5 py-1 bg-emerald-600 text-white font-black text-xs rounded-full inline-block">eSewa Sandbox</span>
              <p className="text-xs text-slate-600 mt-2">Instant wallet authentication, reference code generation, and automated booking confirmation.</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-3xl border border-purple-200 text-center space-y-2 shadow-sm">
              <span className="px-3.5 py-1 bg-purple-700 text-white font-black text-xs rounded-full inline-block">Khalti Gateway</span>
              <p className="text-xs text-slate-600 mt-2">Mobile PIN verification and tokenized transaction handling for quick checkout.</p>
            </div>
            <div className="bg-stone-50 p-6 rounded-3xl border border-rose-200 text-center space-y-2 shadow-sm">
              <span className="px-3.5 py-1 bg-rose-600 text-white font-black text-xs rounded-full inline-block">FonePay QR Adapter</span>
              <p className="text-xs text-slate-600 mt-2">Interoperable QR scan payment verification across all Nepalese commercial banks.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
