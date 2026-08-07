import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, CheckCircle, Star, MapPin, Zap } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';

const RecommendationSection = ({ onSelectHomestay }) => {
  const { t } = useLanguage();
  const [selectedModel, setSelectedModel] = useState('ncf');
  const [recommendations, setRecommendations] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRecommendations(selectedModel);
    fetchEvaluationMetrics();
  }, [selectedModel]);

  const fetchRecommendations = async (model) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/ai/recommendations?model=${model}&top_n=5`);
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error('AI Fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEvaluationMetrics = async () => {
    try {
      const res = await axios.get('/api/ai/model-comparison');
      setMetrics(res.data.metrics || []);
    } catch (err) {
      console.error('Metrics Fetch failed:', err);
    }
  };

  const currentMetric = metrics.find(m => 
    (selectedModel === 'cbf' && m.model.includes('CBF')) ||
    (selectedModel === 'ubcf' && m.model.includes('UBCF')) ||
    (selectedModel === 'ncf' && m.model.includes('NCF'))
  );

  return (
    <section className="my-12 bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-lg border border-stone-200 relative overflow-hidden">
      
      <div className="relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200 mb-3">
              <Sparkles className="w-4 h-4 text-rose-600" />
              <span>Hybrid AI Recommendation Engine (FR-03)</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">{t('ai.title')}</h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">{t('ai.subtitle')}</p>
          </div>

          {/* Model Selector Tabs */}
          <div className="flex bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
            <button
              onClick={() => setSelectedModel('cbf')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedModel === 'cbf' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('ai.cbf_btn')}
            </button>
            <button
              onClick={() => setSelectedModel('ubcf')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedModel === 'ubcf' ? 'bg-teal-700 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('ai.ubcf_btn')}
            </button>
            <button
              onClick={() => setSelectedModel('ncf')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                selectedModel === 'ncf' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('ai.ncf_btn')}
            </button>
          </div>
        </div>

        {/* Current Active Metric Card Banner */}
        {currentMetric && (
          <div className="bg-stone-50 rounded-2xl p-5 mb-8 border border-stone-200 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Selected Algorithm</span>
              <span className="text-xs font-black text-slate-900 mt-1 block">{currentMetric.model}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">{t('ai.precision')}</span>
              <span className="text-xl font-black text-emerald-700 mt-1 block">{(currentMetric.precision_at_10 * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">{t('ai.recall')}</span>
              <span className="text-xl font-black text-teal-700 mt-1 block">{(currentMetric.recall_at_10 * 100).toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">{t('ai.f1')}</span>
              <span className="text-xl font-black text-rose-600 mt-1 block">{currentMetric.f1_score}</span>
            </div>
          </div>
        )}

        {/* Top-5 Recommended Grid */}
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs">Executing {selectedModel.toUpperCase()} Matrix Prediction...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendations.map((h, idx) => (
              <div
                key={h.id || h.homestay_id || idx}
                onClick={() => onSelectHomestay && onSelectHomestay(h)}
                className="bg-stone-50/80 rounded-2xl p-4 border border-stone-200 hover:border-rose-400 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="relative mb-3 overflow-hidden rounded-xl h-36">
                    <img
                      src={h.images?.[0] || (Array.isArray(h.images) ? h.images[0] : null) || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                      alt={h.title_en || h.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80';
                      }}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                      #{idx + 1} AI Pick
                    </div>
                    <div className="absolute bottom-2 right-2 bg-emerald-800 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                      <Zap className="w-3 h-3 fill-amber-300 text-amber-300" />
                      {((h.match_score || h.score || 0.88) * 100).toFixed(0)}% Match
                    </div>
                  </div>

                  <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider block mb-1">
                    {h.cultural_tag} Heritage
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-rose-600 transition-colors">
                    {h.title_en || h.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    {h.district}, Nepal
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-700">
                    NPR {h.price_per_night} <span className="text-[10px] font-normal text-slate-500">/night</span>
                  </span>
                  <span className="text-[10px] text-rose-600 font-extrabold group-hover:underline">
                    View
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default RecommendationSection;
