import React, { useState, useEffect } from 'react';
import { PlusCircle, Mic, CheckCircle, Clock, MapPin, Building, Image as ImageIcon, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import VoiceAssistedForm from '../components/VoiceAssistedForm';

const NEPAL_DISTRICTS = [
  "Kaski", "Solukhumbu", "Chitwan", "Bhaktapur", "Mustang", "Ilam", "Rasuwa", "Palpa", "Tanahun", "Bardiya", "Sindhuli"
];

const HostDashboard = () => {
  const { lang, t } = useLanguage();
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'listings'

  // Listing Form State
  const [titleEn, setTitleEn] = useState('');
  const [titleNe, setTitleNe] = useState('');
  const [district, setDistrict] = useState('Kaski');
  const [village, setVillage] = useState('Ghandruk');
  const [price, setPrice] = useState('1800');
  const [capacity, setCapacity] = useState('4');
  const [culturalTag, setCulturalTag] = useState('Gurung');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [descriptionNe, setDescriptionNe] = useState('');
  const [message, setMessage] = useState('');

  // My Homestays State
  const [myHomestays, setMyHomestays] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);

  useEffect(() => {
    fetchMyHomestays();
  }, [user]);

  const fetchMyHomestays = async () => {
    setLoadingListings(true);
    try {
      const res = await axios.get('/api/homestays');
      if (res.data) {
        // Filter by user.id if present or user.email/name
        const filtered = res.data.filter(h => 
          (user?.id && h.host_id === user.id) || 
          (user?.name && h.host_name?.toLowerCase().includes(user.name.toLowerCase().split(' ')[0]))
        );
        setMyHomestays(filtered.length > 0 ? filtered : res.data);
      }
    } catch (err) {
      console.error('Failed to fetch my homestays:', err);
    } finally {
      setLoadingListings(false);
    }
  };

  const handleVoiceData = (data) => {
    if (data.district) setDistrict(data.district);
    if (data.village) setVillage(data.village);
    if (data.cultural_tag) setCulturalTag(data.cultural_tag);
    if (data.price_per_night) setPrice(data.price_per_night);
    if (data.transcript) {
      setTitleEn(data.transcript);
      setTitleNe(data.transcript);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('/api/homestays', {
        title_en: titleEn,
        title_ne: titleNe,
        description_en: descriptionEn,
        description_ne: descriptionNe,
        district,
        village,
        price_per_night: parseFloat(price),
        capacity: parseInt(capacity),
        cultural_tag: culturalTag,
        amenities: ['Hot Shower', 'Local Cultural Dinner', 'Organic Breakfast'],
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80']
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Homestay submitted successfully! Pending admin verification.');
      fetchMyHomestays();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Host Management Portal</h1>
          <p className="text-sm text-slate-600 mt-1">Digitising rural Nepal homestays with voice assistance (FR-04 & FR-10).</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'create' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            Create Listing
          </button>
          <button
            onClick={() => {
              setActiveTab('listings');
              fetchMyHomestays();
            }}
            className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'listings' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600'}`}
          >
            My Homestays ({myHomestays.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' && (
        <div className="max-w-4xl mx-auto">
          
          {/* FR-10 Voice Assisted Host Onboarding Banner */}
          <VoiceAssistedForm onVoiceData={handleVoiceData} currentLanguage={lang} />

          {/* Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{t('host.create_title')}</h2>

            {message && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl mb-6">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_title_en')}</label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Ghandruk Traditional Gurung Homestay"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_title_ne')}</label>
                  <input
                    type="text"
                    value={titleNe}
                    onChange={(e) => setTitleNe(e.target.value)}
                    placeholder="उदा: घान्द्रुक परम्परागत गुरुङ होमस्टे"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_district')}</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                  >
                    {NEPAL_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_village')}</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_culture')}</label>
                  <select
                    value={culturalTag}
                    onChange={(e) => setCulturalTag(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                  >
                    <option value="Gurung">Gurung</option>
                    <option value="Sherpa">Sherpa</option>
                    <option value="Tharu">Tharu</option>
                    <option value="Newari">Newari</option>
                    <option value="Thakali">Thakali</option>
                    <option value="Tamang">Tamang</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_price')}</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-2">{t('host.field_capacity')}</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-2">Description (English)</label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Describe your organic food, mountain views, and cultural dance..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl text-xs"
              >
                {t('host.submit')}
              </button>

            </form>
          </div>
        </div>
      )}

      {activeTab === 'listings' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-xl font-black text-slate-900">Active Host Listings</h3>
            <span className="text-xs font-bold text-slate-500">{myHomestays.length} Listings Found</span>
          </div>

          {loadingListings ? (
            <div className="py-12 text-center text-slate-400 font-bold text-xs">Loading listings from database...</div>
          ) : myHomestays.length === 0 ? (
            <div className="text-center py-16">
              <Building className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-xs text-slate-500 font-bold">No homestays found for this host.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myHomestays.map(h => (
                <div key={h.id} className="p-5 border border-slate-200 rounded-2xl bg-slate-50 shadow-sm hover:shadow-md transition-all">
                  <div className="h-32 mb-3 rounded-xl overflow-hidden relative">
                    <img
                      src={h.images?.[0] || (Array.isArray(h.images) ? h.images[0] : null) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                      alt={h.title_en}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black uppercase text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                      {h.cultural_tag}
                    </span>
                    {h.is_verified === 1 ? (
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-700" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-black text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-200">
                        Pending Admin Audit
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-black text-slate-900 text-sm mb-1">{h.title_en}</h4>
                  <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" /> {h.village}, {h.district}
                  </p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 text-xs">
                    <span className="font-black text-emerald-800">NPR {h.price_per_night} / night</span>
                    <span className="text-[11px] text-slate-500 font-bold">Cap: {h.capacity} guests</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default HostDashboard;
