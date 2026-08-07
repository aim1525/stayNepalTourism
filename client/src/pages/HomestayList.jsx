import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter, Star, Compass, ShieldCheck, Sparkles, SlidersHorizontal } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';

const NEPAL_77_DISTRICTS = [
  "All Districts", "Kaski", "Solukhumbu", "Chitwan", "Bhaktapur", "Mustang", "Ilam", "Rasuwa", "Palpa",
  "Tanahun", "Gorkha", "Dolakha", "Bardiya", "Manang", "Taplejung", "Sankhuwasabha",
  "Kathmandu", "Lalitpur", "Kavrepalanchok", "Nuwakot", "Dhading", "Makwanpur"
];

const CULTURAL_TAGS = ["All Cultures", "Gurung", "Sherpa", "Tharu", "Newari", "Thakali", "Kirat", "Tamang", "Magar", "Mithila"];

const HomestayList = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);

  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [culturalTag, setCulturalTag] = useState(searchParams.get('cultural_tag') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    fetchHomestays();
  }, [district, maxPrice, culturalTag, searchTerm]);

  const fetchHomestays = async () => {
    setLoading(true);
    try {
      let url = `/api/homestays?max_price=${maxPrice}`;
      if (district && district !== 'All Districts') url += `&district=${district}`;
      if (culturalTag && culturalTag !== 'All Cultures') url += `&cultural_tag=${culturalTag}`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const res = await axios.get(url);
      setHomestays(res.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 border-b border-stone-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>PostGIS Spatial Coordinates (77 Districts)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {lang === 'ne' ? 'नेपालका ७७ जिल्लाका होमस्टे खोज्नुहोस्' : 'Explore Rural Homestays Across Nepal'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Bilingual rural tourism platform matching authentic village stays with AI recommendation filters.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar (FR-02) */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md h-fit space-y-6">
            <div className="flex items-center gap-2 font-black text-slate-900 border-b border-stone-100 pb-4 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-rose-600" />
              <span>Search Filters (FR-02)</span>
            </div>

            {/* Search Keyword */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-2">Search Keyword</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Village or homestay name..."
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
                />
              </div>
            </div>

            {/* District Selector */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-2">District Filter</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
              >
                {NEPAL_77_DISTRICTS.map(d => (
                  <option key={d} value={d === 'All Districts' ? '' : d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Cultural Group */}
            <div>
              <label className="text-xs font-black text-slate-700 block mb-2">{t('filter.cultural_experience')}</label>
              <select
                value={culturalTag}
                onChange={(e) => setCulturalTag(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
              >
                {CULTURAL_TAGS.map(c => (
                  <option key={c} value={c === 'All Cultures' ? '' : c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-black text-slate-700 mb-2">
                <span>{t('filter.price_range')}</span>
                <span className="text-rose-600">NPR {maxPrice}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="5000"
                step="200"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-rose-600"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-20 text-center text-slate-400">
                <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-xs font-bold text-slate-500">Querying spatial database across Nepal districts...</p>
              </div>
            ) : homestays.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm">
                <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-black text-slate-800">No homestays found matching criteria</h3>
                <p className="text-xs text-slate-500 mt-1">Try expanding your price range or district filter.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {homestays.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => navigate(`/homestays/${h.id}`)}
                    className="bg-white rounded-3xl border border-stone-200 hover:border-rose-400 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={h.images?.[0] || (Array.isArray(h.images) ? h.images[0] : null) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'}
                          alt={h.title_en}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {h.is_verified === 1 && (
                          <div className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-amber-700 text-xs font-black px-2.5 py-1 rounded-xl flex items-center gap-1 border border-stone-200 shadow-md">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> 4.9
                        </div>
                      </div>

                      <div className="p-6">
                        <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md border border-amber-200">
                          {h.cultural_tag} Heritage
                        </span>
                        <h3 className="text-lg font-black text-slate-900 mt-2 group-hover:text-rose-600 transition-colors line-clamp-1">
                          {h.title_en}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {h.village}, {h.district} District
                        </p>
                        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                          {h.description_en}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-black text-emerald-800">NPR {h.price_per_night}</span>
                        <span className="text-xs text-slate-500 font-medium"> / night</span>
                      </div>
                      <span className="px-4 py-2 bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white text-xs font-black rounded-xl shadow-md group-hover:opacity-95 transition-opacity">
                        Book Now
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default HomestayList;
