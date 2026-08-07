import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Mail, Lock, Sparkles, ShieldCheck, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import Logo from '../components/Logo';

const Login = () => {
  const { loginWithApi, switchRoleDemo } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginWithApi(email, password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'admin') navigate('/admin');
      else if (result.user.role === 'host') navigate('/host');
      else navigate('/homestays');
    } else {
      setError(result.error || 'Authentication failed. Please check credentials.');
    }
  };

  const handleDemoClick = (role) => {
    switchRoleDemo(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'host') navigate('/host');
    else navigate('/homestays');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-stone-100 text-slate-900 relative overflow-hidden py-12 px-4 sm:px-6">
      
      {/* Warm Background Pattern */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
          alt="Nepal Mountain Panorama"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-100 via-stone-100/90 to-stone-100/70"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        
        {/* Top Logo Container */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" dark={false} />
        </div>

        {/* Clean Light Glassmorphic Login Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-stone-200/80 relative">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-black mb-3">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>{lang === 'ne' ? 'सुरक्षित प्रमाणीकरण' : 'Secure JWT Authentication'}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              {lang === 'ne' ? 'खातामा प्रवेश गर्नुहोस्' : 'Sign In to StayNepal'}
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              {lang === 'ne' ? 'नेपालका ७७ जिल्लाहरूमा एआई होमस्टे अनुभव गर्नुहोस्' : 'Access your personalized AI recommendations & homestay bookings'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 shadow-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                {lang === 'ne' ? 'इमेल ठेगाना' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tourist@staynepal.com"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-xs font-bold outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                {lang === 'ne' ? 'पासवर्ड' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 text-slate-900 rounded-2xl border border-stone-300 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20 text-xs font-bold outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{lang === 'ne' ? 'साइन इन गर्नुहोस्' : 'Sign In Now'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Logins */}
          <div className="mt-8 pt-6 border-t border-stone-200 text-center">
            <span className="text-[11px] font-black text-slate-500 block mb-3 uppercase tracking-wider">
              {lang === 'ne' ? 'डेमो खाताबाट तत्काल प्रवेश:' : 'Quick One-Click Demo Login:'}
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoClick('tourist')}
                className="px-2 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 text-[10px] font-black rounded-2xl border border-rose-200 transition-all flex flex-col items-center gap-1 shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-rose-600" />
                <span>Tourist</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('host')}
                className="px-2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[10px] font-black rounded-2xl border border-emerald-200 transition-all flex flex-col items-center gap-1 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Host</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoClick('admin')}
                className="px-2 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-black rounded-2xl border border-amber-200 transition-all flex flex-col items-center gap-1 shadow-sm"
              >
                <LogIn className="w-4 h-4 text-amber-600" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Bottom Register Redirect */}
          <div className="mt-6 text-center text-xs text-slate-600 font-medium">
            {lang === 'ne' ? 'नयाँ प्रयोगकर्ता?' : "Don't have an account?"}{' '}
            <Link to="/register" className="text-rose-600 font-black hover:underline">
              {lang === 'ne' ? 'यहाँ दर्ता गर्नुहोस्' : 'Register here'}
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;
