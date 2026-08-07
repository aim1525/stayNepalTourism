import React from 'react';
import { Mountain } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const Logo = ({ size = 'md', dark = false }) => {
  const { lang } = useLanguage();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg lg:text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2 group select-none cursor-pointer flex-shrink-0">
      
      {/* Mountain Heritage Icon Badge */}
      <div className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-rose-600 via-amber-600 to-emerald-700 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300 flex-shrink-0`}>
        <Mountain className="w-3/5 h-3/5" />
      </div>

      {/* Brand Text */}
      <div className="flex-shrink-0">
        <div className={`font-black tracking-tight ${textSizes[size]} flex items-center leading-none`}>
          <span className={dark ? 'text-white' : 'text-slate-900'}>Stay</span>
          <span className="bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent ml-0.5">Nepal</span>
        </div>
        <span className={`hidden xl:block text-[9px] font-extrabold uppercase tracking-widest font-sans mt-0.5 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
          {lang === 'ne' ? '७७ जिल्ला होमस्टे नेटवर्क' : '77 Districts Network'}
        </span>
      </div>

    </div>
  );
};

export default Logo;
