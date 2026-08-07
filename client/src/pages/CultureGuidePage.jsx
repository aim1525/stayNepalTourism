import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Sparkles, MapPin, Heart, Flame, Shield, ArrowRight, Utensils, Music, Calendar } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const CULTURAL_HERITAGES = [
  {
    id: 'gurung',
    nameEn: 'Gurung Heritage (Tamu)',
    nameNe: 'गुरुङ संस्कृति (तमु)',
    districts: 'Kaski, Lamjung, Gorkha, Syangja, Manang',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=80',
    delicacyEn: 'Kodo ko Dhido, Local Chicken Curry, Sukuti, Organic Honey',
    musicEn: 'Rodhi Ghar Songs, Sorathi Dance, Ghantu Dance',
    festivalEn: 'Tamu Lhosar, Maghe Sakranti',
    descriptionEn: 'Famed for mountain brave hospitality, slate-roof villages in Ghandruk and Sikles, vibrant Rodhi cultural gatherings, and deep shamanic Buddhist traditions.'
  },
  {
    id: 'sherpa',
    nameEn: 'Sherpa Alpine Culture',
    nameNe: 'शेर्पा हिमाली संस्कृति',
    districts: 'Solukhumbu, Sankhuwasabha, Taplejung, Dolakha',
    image: 'https://images.unsplash.com/photo-1585807507699-23c2eae57327?auto=format&fit=crop&w=1000&q=80',
    delicacyEn: 'Su-Chya (Butter Tea), Tsampa, Riki Kur (Potato Pancake), Yak Cheese',
    musicEn: 'Syabru Dance, Tibetan Buddhist Chants',
    festivalEn: 'Gyalpo Lhosar, Dumji Festival, Mani Rimdu',
    descriptionEn: 'High-altitude mountaineering legends of Everest region, monastery prayer flags, warm stone lodges, hearth fireplace stories, and herbal butter teas.'
  },
  {
    id: 'tharu',
    nameEn: 'Tharu Jungle Eco Culture',
    nameNe: 'थारु तराई संस्कृति',
    districts: 'Chitwan, Bardiya, Kailali, Dang, Nawalpur',
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1000&q=80',
    delicacyEn: 'Ghonghi (River Snails), Anadi Rice, Chhuchhari Fish, Sidhra',
    musicEn: 'Tharu Lathi (Stick) Dance, Jhumra Dance',
    festivalEn: 'Maghi, Jitia Festival, Faguwa',
    descriptionEn: 'Indigenous guardians of Terai jungles, mud mural decorated eco-homestays, stick dancing, elephant safari trails, and rich wetland biodiversity knowledge.'
  },
  {
    id: 'newari',
    nameEn: 'Newari Valley Urban Heritage',
    nameNe: 'नेवारी उपत्यका हेरिटेज',
    districts: 'Kathmandu, Lalitpur, Bhaktapur, Tanahun (Bandipur), Palpa',
    image: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=1000&q=80',
    delicacyEn: 'Samay Baji, Juju Dhau (King Curd), Yomari, Bara, Chhoila',
    musicEn: 'Dhime Drumming, Lakhey Mask Dance, Charya Nritya',
    festivalEn: 'Bisket Jatra, Indra Jatra, Yomari Punhi',
    descriptionEn: 'Masters of brick architecture, intricate wood carvings, sacred courtyards (Bahas), ancient fermented feasts, and living heritage cities.'
  },
  {
    id: 'thakali',
    nameEn: 'Thakali Mustang Trade Route Culture',
    nameNe: 'थकाली मुस्ताङ व्यापारिक संस्कृति',
    districts: 'Mustang, Myagdi, Parbat',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    delicacyEn: 'Authentic Thakali Thali (Jimbu Black Dal, Buckwheat, Sukuti, Apple Brandy)',
    musicEn: 'Thakali Folk Songs, Archery Tournaments (Toranla)',
    festivalEn: 'Toranla Festival, Lha Phewa',
    descriptionEn: 'Famed hospitality along the ancient salt trading route through Marpha and Jomsom, apple orchards, stone homes, and refined culinary perfection.'
  },
  {
    id: 'kirat',
    nameEn: 'Kirat / Rai & Limbu Culture',
    nameNe: 'किरात / राई र लिम्बु संस्कृति',
    districts: 'Ilam, Panchthar, Taplejung, Dhankuta, Khotang',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    delicacyEn: 'Tongba (Millet Beer), Wachipa, Kinema, Chyangba',
    musicEn: 'Sakela Sili Dance, Chyabrung Drumming',
    festivalEn: 'Sakela Ubhauli & Udhauli, Chasok Tangnam',
    descriptionEn: 'Eastern hills green tea gardens, ancestor worship, nature reverence (Yuma Samyo), bamboo straw warm millet brew, and rhythmic Sakela dance.'
  }
];

const CultureGuidePage = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();
  const [selectedCulture, setSelectedCulture] = useState(CULTURAL_HERITAGES[0]);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200 mb-4 shadow-sm">
            <Compass className="w-4 h-4 text-rose-600" />
            <span>{lang === 'ne' ? 'नेपालका ७७ जिल्लाका सांस्कृतिक विविधता' : '77 Districts Cultural Heritage Guide'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            {lang === 'ne' ? 'मौलिक ग्रामीण संस्कृति र आतिथ्यता' : 'Discover Nepal’s Cultural Mosaic'}
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            {lang === 'ne' 
              ? 'गुरुङ, शेर्पा, थारु, नेवार, थकाली र किरात समुदायहरूको परम्परागत जीवनशैली, परिकार र होमस्टे अनुभव गर्नुहोस्।' 
              : 'Explore the rich ethnic traditions, indigenous recipes, traditional music, and authentic village homestays across Nepal.'}
          </p>
        </div>

        {/* Heritage Selector Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {CULTURAL_HERITAGES.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCulture(c)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all border ${
                selectedCulture.id === c.id
                  ? 'bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white border-rose-600 shadow-md scale-105'
                  : 'bg-white text-slate-700 border-stone-200 hover:bg-stone-100'
              }`}
            >
              {lang === 'ne' ? c.nameNe : c.nameEn}
            </button>
          ))}
        </div>

        {/* Detailed Hero Card for Selected Heritage */}
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-0 mb-16">
          <div className="lg:col-span-6 relative min-h-[320px] lg:min-h-[480px]">
            <img
              src={selectedCulture.image}
              alt={selectedCulture.nameEn}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3.5 py-1.5 rounded-full shadow-md">
              {selectedCulture.districts.split(',')[0]} Region
            </div>
          </div>

          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs font-black text-amber-700 uppercase tracking-widest block mb-2">
                Featured Cultural Identity
              </span>
              <h2 className="text-3xl font-black text-slate-900">
                {lang === 'ne' ? selectedCulture.nameNe : selectedCulture.nameEn}
              </h2>
              <p className="text-xs text-rose-700 font-black mt-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>Primary Districts: {selectedCulture.districts}</span>
              </p>
              <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                {selectedCulture.descriptionEn}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-amber-700 text-xs font-black mb-1">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Signature Food</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-snug">{selectedCulture.delicacyEn}</p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-teal-700 text-xs font-black mb-1">
                  <Music className="w-3.5 h-3.5" />
                  <span>Music & Dance</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-snug">{selectedCulture.musicEn}</p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                <div className="flex items-center gap-1.5 text-rose-600 text-xs font-black mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Major Festivals</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium leading-snug">{selectedCulture.festivalEn}</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(`/homestays?cultural_tag=${selectedCulture.id}`)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-rose-600/20 hover:opacity-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Browse {selectedCulture.nameEn.split(' ')[0]} Homestays</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Community Homestay Etiquette Guidelines */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-emerald-700" />
            <h3 className="text-xl font-black text-slate-900">Responsible Tourism & Homestay Etiquette</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-600">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <span className="text-amber-800 font-black text-sm block mb-2">1. Respect Local Customs</span>
              Remove shoes before entering traditional living quarters and sacred prayer altars.
            </div>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <span className="text-emerald-800 font-black text-sm block mb-2">2. Support Local Farmers</span>
              Enjoy fresh organic meals prepared by host families using village-harvested produce.
            </div>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <span className="text-teal-800 font-black text-sm block mb-2">3. Zero Plastic Waste</span>
              Refill water bottles from village boiling stations to keep rural trails pristine.
            </div>
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <span className="text-rose-700 font-black text-sm block mb-2">4. Cultural Exchange</span>
              Participate respectfully in evening cultural song & dance performances.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CultureGuidePage;
