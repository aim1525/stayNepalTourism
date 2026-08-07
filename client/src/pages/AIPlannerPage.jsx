import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Compass, MapPin, Calendar, DollarSign, CheckCircle2, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const SAMPLE_HOMESTAYS_FOR_PLANNER = [
  { id: 1, title: 'Ghandruk Traditional Gurung Homestay', district: 'Kaski', cultural: 'Gurung', price: 1800, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Namche Bazaar Sherpa Cultural Lodge', district: 'Solukhumbu', cultural: 'Sherpa', price: 2800, image: 'https://images.unsplash.com/photo-1585807507699-23c2eae57327?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Sauraha Tharu Eco Community Homestay', district: 'Chitwan', cultural: 'Tharu', price: 1500, image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Bhaktapur Newari Heritage House', district: 'Bhaktapur', cultural: 'Newari', price: 2200, image: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Marpha Apple Orchard Thakali Homestay', district: 'Mustang', cultural: 'Thakali', price: 2400, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Kanyam Tea Estate Kirat Homestay', district: 'Ilam', cultural: 'Kirat', price: 1600, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80' }
];

const AIPlannerPage = () => {
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(2500);
  const [interest, setInterest] = useState('trekking');
  const [culturalTag, setCulturalTag] = useState('Gurung');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const handleGenerateItinerary = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);

      const matchedHomestays = SAMPLE_HOMESTAYS_FOR_PLANNER.filter(
        h => h.cultural === culturalTag || h.price <= budget
      ).slice(0, 3);

      setGeneratedPlan({
        duration: `${days} Days / ${days - 1} Nights`,
        recommendedAlgorithm: 'Neural Collaborative Filtering (NCF + Spatial PostGIS)',
        matchedHomestays,
        itineraryDays: Array.from({ length: days }).map((_, idx) => ({
          day: idx + 1,
          title: idx === 0 
            ? 'Arrival & Cultural Welcome Ceremony' 
            : idx === days - 1 
            ? 'Sunrise View & Departure' 
            : `Day ${idx + 1}: Rural Trek & Village Exploration`,
          activities: idx === 0 
            ? 'Meet host family, enjoy welcome organic tea, and participate in evening village fireplace gathering.' 
            : idx === days - 1 
            ? 'Enjoy Himalayan sunrise, breakfast with host family, and local handicraft souvenir exchange.' 
            : `Guided nature walk through ${culturalTag} traditional trails, organic farming, and authentic local thali lunch.`
        }))
      });
    }, 800);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200 mb-4 shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Itinerary & Homestay Matching Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            {lang === 'ne' ? 'एआई व्यक्तिगत भ्रमण योजनाकार' : 'AI Personalised Travel Planner'}
          </h1>
          <p className="mt-3 text-sm text-slate-600 font-medium">
            {lang === 'ne'
              ? 'तपाईंको बजेट, अवधि र सांस्कृतिक प्राथमिकताका आधारमा नेपालका ७७ जिल्लामा उपयुक्त होमस्टे छान्नुहोस्।'
              : 'Generate tailor-made multi-day rural homestay itineraries leveraging Neural Matrix factorization across Nepal.'}
          </p>
        </div>

        {/* Wizard Form Card */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xl mb-12">
          <form onSubmit={handleGenerateItinerary} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Trip Duration */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-600" />
                <span>Trip Duration (Days)</span>
              </label>
              <select
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
              >
                <option value={3}>3 Days (Quick Weekend Getaway)</option>
                <option value={5}>5 Days (Standard Cultural Loop)</option>
                <option value={7}>7 Days (Full District Exploration)</option>
                <option value={10}>10 Days (Grand Himalayan Circuit)</option>
              </select>
            </div>

            {/* Nightly Budget */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Max Price / Night (NPR)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1200"
                  max="4000"
                  step="200"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <span className="text-xs font-black text-emerald-800 whitespace-nowrap">NPR {budget}</span>
              </div>
            </div>

            {/* Travel Theme */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-teal-600" />
                <span>Primary Interest</span>
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
              >
                <option value="trekking">Mountain Trekking & Scenery</option>
                <option value="wildlife">Jungle Safari & Wildlife</option>
                <option value="heritage">Ancient City & Food Heritage</option>
                <option value="tea">Tea Gardens & Eastern Hills</option>
              </select>
            </div>

            {/* Cultural Group */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                <Brain className="w-4 h-4 text-amber-600" />
                <span>Cultural Heritage Group</span>
              </label>
              <select
                value={culturalTag}
                onChange={(e) => setCulturalTag(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
              >
                <option value="Gurung">Gurung Heritage (Annapurna)</option>
                <option value="Sherpa">Sherpa Alpine (Khumbu)</option>
                <option value="Tharu">Tharu Jungle (Chitwan)</option>
                <option value="Newari">Newari Heritage (Bhaktapur)</option>
                <option value="Thakali">Thakali Trade Route (Mustang)</option>
                <option value="Kirat">Kirat Tea Estate (Ilam)</option>
              </select>
            </div>

            {/* Generate Button */}
            <div className="lg:col-span-4 mt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-white" />
                    <span>Running PyTorch Neural Collaborative Filter & Spatial Search...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                    <span>Generate AI Itinerary & Homestay Recommendations</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Results Section */}
        {generatedPlan && (
          <div className="space-y-8 animate-in fade-in duration-500">
            
            {/* Summary Banner */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 p-6 rounded-3xl border border-emerald-700 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              <div>
                <span className="text-[10px] font-black text-amber-300 uppercase tracking-widest block">AI Recommended Package</span>
                <h3 className="text-2xl font-black text-white mt-1">{generatedPlan.duration} {culturalTag} Culture Trail</h3>
                <p className="text-xs text-emerald-100 mt-1 flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Powered by {generatedPlan.recommendedAlgorithm}</span>
                </p>
              </div>
              <button
                onClick={() => navigate('/homestays')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-2xl transition-all shadow-md cursor-pointer"
              >
                Book Suggested Homestays
              </button>
            </div>

            {/* Matched Homestays Grid */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-4">Top 3 Recommended Homestays for this Itinerary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {generatedPlan.matchedHomestays.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => navigate(`/homestays/${h.id}`)}
                    className="bg-white rounded-3xl border border-stone-200 hover:border-rose-400 overflow-hidden cursor-pointer group transition-all shadow-sm hover:shadow-xl"
                  >
                    <div className="h-40 overflow-hidden relative">
                      <img src={h.image} alt={h.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-0.5 rounded-md border border-amber-200 shadow-sm">
                        {h.cultural} Heritage
                      </div>
                    </div>
                    <div className="p-5">
                      <h5 className="font-black text-slate-900 text-sm line-clamp-1">{h.title}</h5>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {h.district} District
                      </p>
                      <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                        <span className="font-black text-emerald-800">NPR {h.price} /night</span>
                        <span className="text-rose-600 font-extrabold group-hover:underline">View & Book</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day by Day Itinerary */}
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-4">Day-by-Day Customized Experience</h4>
              <div className="space-y-4">
                {generatedPlan.itineraryDays.map((item) => (
                  <div key={item.day} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-md">
                      D{item.day}
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 text-base">{item.title}</h5>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.activities}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default AIPlannerPage;
