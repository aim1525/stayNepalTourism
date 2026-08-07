import React from 'react';
import { Heart, Globe, Award, Shield, Compass, Mountain } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SDG Section Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-8 border border-emerald-700/50 mb-12 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase px-3.5 py-1 rounded-full border border-emerald-500/30">
              UN SDGs Impact
            </span>
            <h3 className="text-2xl font-black text-white mt-3">
              {t('sdg.title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl font-black text-xl">
                08
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">SDG 8: Decent Work</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('sdg.sdg8')}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-start gap-4">
              <div className="p-3 bg-rose-500/20 text-rose-300 rounded-xl font-black text-xl">
                10
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">SDG 10: Reduced Inequalities</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('sdg.sdg10')}</p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 flex items-start gap-4">
              <div className="p-3 bg-cyan-500/20 text-cyan-300 rounded-xl font-black text-xl">
                17
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">SDG 17: Partnerships</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('sdg.sdg17')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-md">
                <Mountain className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white">StayNepal</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Bilingual AI-Powered Rural Homestay Booking Platform digitising tourism infrastructure across all 77 districts of Nepal.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Project Credits</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>Student: <span className="text-white font-bold">Aim Kumar Yonjan</span></li>
              <li>ID: <span className="text-amber-400 font-mono font-bold">NP069653</span></li>
              <li>Programme: <span className="text-white">BSc (Hons) Information Technology</span></li>
              <li>Final Year Project (FYP) Grade 10/10</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">AI Algorithms</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>Content-Based Filtering (CBF - TF-IDF)</li>
              <li>Collaborative Filtering (UBCF - JM Distance)</li>
              <li>Neural Collaborative Filtering (NCF PyTorch)</li>
              <li>K-Fold Evaluation (Precision@10, Recall@10)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider mb-4">Payment Gateways</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>eSewa Sandbox API v2</li>
              <li>Khalti e-Payment SDK v2</li>
              <li>FonePay Merchant QR Adapter</li>
              <li>Unified PaymentService Interface</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center text-xs text-slate-400 font-medium">
          <p>© 2026 StayNepal System — All Rights Reserved. Designed for Rural Nepal Tourism Development.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
