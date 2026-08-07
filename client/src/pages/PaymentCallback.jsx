import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    verifyCallback();
  }, []);

  const verifyCallback = async () => {
    const status = searchParams.get('status') || searchParams.get('q');
    const gateway = searchParams.get('gateway') || 'esewa';
    const pid = searchParams.get('pid') || searchParams.get('oid') || searchParams.get('pidx') || searchParams.get('refId');
    const refId = searchParams.get('refId') || searchParams.get('ref') || 'ESEWA-REF-' + Math.floor(Math.random() * 900000 + 100000);

    try {
      const res = await axios.post('/api/payments/verify', {
        gateway,
        transaction_id: pid,
        refId,
        pid
      });

      if (res.data.verification?.success) {
        setSuccess(true);
        setMessage('eSewa Payment Verified Successfully!');
        setDetails(res.data.verification);
      } else {
        setSuccess(false);
        setMessage('Payment verification failed.');
      }
    } catch (err) {
      setSuccess(false);
      setMessage(err.response?.data?.error || 'Payment verification encountered an issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 border border-stone-200 shadow-2xl text-center">
        {loading ? (
          <div className="py-12">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-black text-slate-900">Verifying eSewa Payment...</h3>
            <p className="text-xs text-slate-500 mt-1">Connecting with eSewa Sandbox Gateway API...</p>
          </div>
        ) : success ? (
          <div>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-3">
              eSewa Payment Success
            </span>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
            <p className="text-xs text-slate-600 mb-6">
              Your homestay reservation has been paid & confirmed via eSewa Sandbox.
            </p>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2 mb-6 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway:</span>
                <span className="font-bold uppercase text-emerald-700">eSewa Sandbox</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ref Code:</span>
                <span className="font-bold text-slate-900">{details?.refId || 'REF-OK'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700 uppercase">Confirmed</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/my-bookings')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>View My Bookings</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Failed</h2>
            <p className="text-xs text-slate-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/homestays')}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl transition-all"
            >
              Return to Homestays
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
