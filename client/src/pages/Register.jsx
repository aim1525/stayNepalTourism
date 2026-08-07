import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, Globe, Sparkles, ArrowRight, AlertCircle, Compass, Home as HomeIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import Logo from '../components/Logo';

const Register = () => {
  const { registerWithApi } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'tourist',
    phone: '',
    preferred_language: 'en'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await registerWithApi(formData);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'host') navigate('/host');
      else navigate('/homestays');
    } else {
      setError(result.error || 'Registration failed. Please verify details.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-stone-100 text-slate-900 relative overflow-hidden py-12 px-4 sm:px-6">
      
      {/* Background Mountain Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
          alt="Nepal Hills Panorama"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-100/90 to-stone-100/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* Top Brand Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" dark={false} />
        </div>

        {/* Futuristic Warm Light Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-stone-200/80 relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{lang === 'ne' ? 'नयाँ खाता सिर्जना गर्नुहोस्' : 'Join StayNepal Platform'}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {lang === 'ne' ? 'नयाँ प्रयोगकर्ता दर्ता' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'ne' ? 'पर्यटक वा होस्टको रूपमा नेपालभरि जोडिनुहोस्' : 'Connect as a Tourist or Host across all 77 Districts'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Account Role Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                {lang === 'ne' ? 'खाता प्रकार' : 'Account Role'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'tourist' })}
                  className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    formData.role === 'tourist'
                      ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-rose-600 shadow-md shadow-rose-600/30'
                      : 'bg-stone-50 text-slate-700 border-stone-300 hover:border-slate-400'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>{lang === 'ne' ? 'पर्यटक (Tourist)' : 'Tourist / Traveler'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'host' })}
                  className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                    formData.role === 'host'
                      ? 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                      : 'bg-stone-50 text-slate-700 border-stone-300 hover:border-slate-400'
                  }`}
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>{lang === 'ne' ? 'होमस्टे होस्ट (Host)' : 'Rural Homestay Host'}</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                {lang === 'ne' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sujan Gurung"
                  className="w-full pl-12 pr-4 py-2.5 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-xs font-bold outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                {lang === 'ne' ? 'इमेल ठेगाना' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="sujan@example.com"
                  className="w-full pl-12 pr-4 py-2.5 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-xs font-bold outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Phone & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  {lang === 'ne' ? 'फोन नम्बर' : 'Phone Number'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+977-9800000000"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 text-xs font-bold outline-none shadow-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  {lang === 'ne' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 text-xs font-bold outline-none shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                {lang === 'ne' ? 'प्राथमिकता भाषा' : 'Preferred Language'}
              </label>
              <div className="relative">
                <Globe className="w-5 h-5 text-slate-400 absolute left-4 top-3" />
                <select
                  name="preferred_language"
                  value={formData.preferred_language}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-2.5 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 text-xs font-bold outline-none shadow-sm"
                >
                  <option value="en">English (English UI & Voice)</option>
                  <option value="ne">नेपाली (Nepali UI & Voice)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-700/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{lang === 'ne' ? 'दर्ता सम्पन्न गर्नुहोस्' : 'Complete Registration'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Already registered */}
          <div className="mt-6 text-center text-xs text-slate-600 font-medium">
            {lang === 'ne' ? 'पहिल्यै खाता छ?' : 'Already have an account?'}{' '}
            <Link to="/login" className="text-emerald-700 font-black hover:underline">
              {lang === 'ne' ? 'यहाँ साइन इन गर्नुहोस्' : 'Sign in here'}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Register;
