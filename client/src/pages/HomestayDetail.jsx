import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, ShieldCheck, Calendar, Users, CheckCircle, CreditCard, Sparkles, User, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const HomestayDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { user, token } = useAuth();

  const [homestay, setHomestay] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [checkIn, setCheckIn] = useState('2026-09-10');
  const [checkOut, setCheckOut] = useState('2026-09-12');
  const [guests, setGuests] = useState(2);
  const [bookingError, setBookingError] = useState('');
  const [activeBooking, setActiveBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Review Form State (FR-07)
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchHomestayDetail();
  }, [id]);

  const fetchHomestayDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/homestays/${id}`);
      setHomestay(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    try {
      const res = await axios.post('/api/bookings', {
        homestay_id: homestay.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: parseInt(guests)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveBooking(res.data.booking);
      setShowPaymentModal(true);
    } catch (err) {
      setBookingError(err.response?.data?.error || 'Booking creation failed');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/reviews', {
        booking_id: activeBooking?.id || 2,
        homestay_id: homestay.id,
        rating: reviewRating,
        cultural_experience_rating: reviewRating,
        comment: reviewComment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviewSuccess(true);
      fetchHomestayDetail();
    } catch (err) {
      alert(err.response?.data?.error || 'Review submission failed');
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs font-bold text-slate-500">Loading homestay spatial details...</p>
      </div>
    );
  }

  if (!homestay) {
    return <div className="p-12 text-center text-slate-500 font-bold">Homestay not found.</div>;
  }

  const imagesList = Array.isArray(homestay.images) 
    ? homestay.images 
    : (typeof homestay.images === 'string' ? JSON.parse(homestay.images || '[]') : []);

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200 shadow-sm">
                {homestay.cultural_tag} Heritage Experience
              </span>
              {homestay.is_verified === 1 && (
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1 border border-emerald-200 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              {lang === 'ne' ? homestay.title_ne : homestay.title_en}
            </h1>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <MapPin className="w-4 h-4 text-rose-500" />
              {homestay.village}, {homestay.district} District (PostGIS Coords: {homestay.latitude}, {homestay.longitude})
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-stone-200 shadow-sm">
            <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
            <span className="text-2xl font-black text-slate-900">{homestay.average_rating || 4.9}</span>
            <span className="text-xs text-slate-500">({homestay.reviews_count || 12} reviews)</span>
          </div>
        </div>

        {/* Main Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <div className="md:col-span-2 h-96">
            <img
              src={imagesList[0] || 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&q=80'}
              alt="Homestay Primary"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:flex flex-col gap-4 h-96">
            <img
              src={imagesList[1] || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80'}
              alt="Homestay Secondary"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-full h-1/2 object-cover"
            />
            <img
              src={imagesList[2] || 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80'}
              alt="Homestay Cultural"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80';
              }}
              className="w-full h-1/2 object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Detail Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Host Profile */}
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-600 to-amber-600 text-white font-black text-xl flex items-center justify-center shadow-md">
                {homestay.host_name?.charAt(0) || 'H'}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Hosted by {homestay.host_name || 'Karsang Gurung'}</h3>
                <p className="text-xs text-slate-500 font-medium">Local Host Family • Phone: {homestay.host_phone || '+977-9811111111'}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-3">About this Cultural Homestay</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {lang === 'ne' ? homestay.description_ne : homestay.description_en}
              </p>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-lg font-black text-slate-900 mb-3">Amenities & Cultural Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(Array.isArray(homestay.amenities) ? homestay.amenities : JSON.parse(homestay.amenities || '[]'))?.map((a, idx) => (
                  <div key={idx} className="p-3.5 bg-white border border-stone-200 rounded-2xl text-xs font-bold text-slate-800 flex items-center gap-2 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    {a}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section (FR-07) */}
            <div className="pt-6 border-t border-stone-200">
              <h3 className="text-xl font-black text-slate-900 mb-6">Guest Cultural Reviews (FR-07)</h3>

              {/* Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm mb-8 space-y-4">
                <h4 className="font-black text-slate-900 text-sm">Submit Your Post-Stay Rating</h4>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Star Rating (1 - 5):</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(parseInt(e.target.value))}
                    className="px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-slate-900 outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent Cultural Stay</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                    <option value={3}>⭐⭐⭐ (3/5) Average</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Comment & Feedback:</label>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with local food, dance, and host family..."
                    className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-slate-900 outline-none focus:border-rose-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 text-white font-black text-xs rounded-xl shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                >
                  Submit Review
                </button>
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-4">
                {homestay.reviews?.map((r) => (
                  <div key={r.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-slate-900 text-xs">{r.tourist_name || 'Tourist Guest'}</span>
                      <div className="flex text-amber-500 text-xs">
                        {'★'.repeat(r.rating)}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Sidebar Booking Box (FR-05) */}
          <div>
            <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-xl sticky top-28 space-y-6">
              <div className="flex items-baseline justify-between pb-4 border-b border-stone-100">
                <div>
                  <span className="text-2xl font-black text-emerald-800">NPR {homestay.price_per_night}</span>
                  <span className="text-xs text-slate-500 font-medium"> / night</span>
                </div>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                  Available
                </span>
              </div>

              {bookingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl">
                  {bookingError}
                </div>
              )}

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">{t('booking.check_in')}</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">{t('booking.check_out')}</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">{t('booking.guests')}</label>
                  <input
                    type="number"
                    min="1"
                    max={homestay.capacity || 5}
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-2xl text-xs font-bold text-slate-900 outline-none focus:border-rose-600"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-rose-600/20 hover:opacity-95 transition-all cursor-pointer"
                >
                  {t('booking.book_now')}
                </button>
              </form>

              <p className="text-[11px] text-center text-slate-400 font-medium">
                Protected by StayNepal Double-Booking Prevention Algorithm (FR-05).
              </p>
            </div>
          </div>

        </div>

        {/* Payment Checkout Modal (FR-06) */}
        {showPaymentModal && activeBooking && (
          <PaymentModal
            booking={activeBooking}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={() => {
              fetchHomestayDetail();
            }}
          />
        )}

      </div>
    </div>
  );
};

export default HomestayDetail;
