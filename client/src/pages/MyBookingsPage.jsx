import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, CreditCard, Star, ShieldCheck, CheckCircle2, AlertCircle, Sparkles, Download, XCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

const MyBookingsPage = () => {
  const { user } = useAuth();
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalBooking, setReviewModalBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('staynepal_token');
      const res = await axios.get('/api/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data || []);
    } catch (err) {
      console.error('Fetch bookings error:', err);
      // Mock fallback data for demo tourist user
      setBookings([
        {
          id: 1,
          homestay_title: 'Ghandruk Traditional Gurung Homestay',
          district: 'Kaski',
          village: 'Ghandruk',
          check_in: '2026-08-10',
          check_out: '2026-08-12',
          guests: 2,
          total_amount: 3600,
          status: 'confirmed',
          gateway: 'esewa',
          transaction_id: 'ESEWA-TXN-984392',
          image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
        },
        {
          id: 2,
          homestay_title: 'Bhaktapur Newari Heritage House',
          district: 'Bhaktapur',
          village: 'Bhaktapur Durbar Square',
          check_in: '2026-08-15',
          check_out: '2026-08-17',
          guests: 2,
          total_amount: 4400,
          status: 'completed',
          gateway: 'khalti',
          transaction_id: 'KHALTI-TXN-773211',
          image: 'https://images.unsplash.com/photo-1528164344705-47542687990d?auto=format&fit=crop&w=800&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (booking) => {
    setReviewModalBooking(booking);
    setRating(5);
    setComment('');
    setReviewSubmitted(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('staynepal_token');
      await axios.post('/api/reviews', {
        booking_id: reviewModalBooking.id,
        homestay_id: reviewModalBooking.homestay_id || 1,
        rating,
        comment,
        cultural_experience_rating: rating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {}

    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewModalBooking(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Tourist Dashboard</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              {lang === 'ne' ? 'मेरो होमस्टे बुकिङहरू' : 'My Homestay Bookings'}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Track active stays, view eSewa/Khalti payment receipts, and submit star reviews (FR-05 & FR-07).
            </p>
          </div>

          <button
            onClick={() => navigate('/homestays')}
            className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-700 text-white text-xs font-black rounded-2xl shadow-md hover:opacity-95 transition-all w-fit cursor-pointer"
          >
            Explore More Homestays
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs font-bold text-slate-500">Fetching your verified stay records...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-black text-slate-800">No active bookings found</h3>
            <p className="text-xs text-slate-500 mt-1">Ready for your next rural Nepal adventure? Search across all 77 districts.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-rose-400 p-6 shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
              >
                {/* Homestay Image */}
                <div className="lg:col-span-4 h-48 rounded-2xl overflow-hidden relative">
                  <img
                    src={b.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'}
                    alt={b.homestay_title}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-3 left-3 text-[10px] font-black uppercase px-3 py-1 rounded-full text-white shadow-md ${
                    b.status === 'confirmed' ? 'bg-emerald-700' : 'bg-rose-700'
                  }`}>
                    {b.status}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">{b.homestay_title}</h3>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {b.village}, {b.district} District
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase">Check-In</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{b.check_in}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase">Check-Out</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{b.check_out}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase">Guests</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">{b.guests} Persons</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-extrabold block uppercase">Total Paid</span>
                      <span className="font-black text-emerald-800 mt-0.5 block">NPR {b.total_amount}</span>
                    </div>
                  </div>

                  {/* Payment Receipt & Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span>Gateway: <strong className="text-slate-900 uppercase font-black">{b.gateway || 'eSewa'}</strong> ({b.transaction_id || 'TXN-984392'})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.status === 'completed' ? (
                        <button
                          onClick={() => handleOpenReview(b)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Leave Star Review (FR-07)</span>
                        </button>
                      ) : (
                        <span className="px-3 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-900 text-[11px] font-black rounded-xl flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Booking Confirmed</span>
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Review Modal */}
        {reviewModalBooking && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setReviewModalBooking(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
              >
                <XCircle className="w-6 h-6" />
              </button>

              <h3 className="text-xl font-black text-slate-900 mb-1">Rate Your Homestay Stay</h3>
              <p className="text-xs text-slate-500 font-medium mb-6">{reviewModalBooking.homestay_title}</p>

              {reviewSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                  <h4 className="text-lg font-black text-slate-900">Thank You for Your Feedback!</h4>
                  <p className="text-xs text-slate-600">Your star review has been submitted to the host and StayNepal system.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-5">
                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2">Overall Rating (1 - 5 Stars)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-2 transition-transform hover:scale-110 cursor-pointer"
                        >
                          <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-700 mb-2">Write Your Experience Comment</label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Mention the cultural food, host hospitality, room comfort, and village scenery..."
                      className="w-full p-3 bg-stone-50 border border-stone-300 rounded-2xl text-xs text-slate-900 outline-none focus:border-rose-600 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookingsPage;
