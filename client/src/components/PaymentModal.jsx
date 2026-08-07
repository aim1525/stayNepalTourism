import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [selectedGateway, setSelectedGateway] = useState('esewa');
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [step, setStep] = useState('select'); // 'select', 'process', 'success'

  const handleInitiate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/payments/initiate', {
        booking_id: booking.id,
        gateway: selectedGateway,
        return_url: window.location.origin + '/payment-callback'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPaymentDetails(res.data.payment);
      setStep('process');
    } catch (err) {
      alert('Payment initiation failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySimulation = async () => {
    setLoading(true);
    try {
      const res = await axios.post('/api/payments/verify', {
        gateway: selectedGateway,
        booking_id: booking.id,
        transaction_id: paymentDetails?.transactionId || `SANDBOX-TXN-${Date.now()}`,
        refId: 'REF-' + Math.floor(Math.random() * 900000 + 100000),
        amount: booking.total_amount
      });

      if (res.data.verification?.success) {
        setStep('success');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      alert('Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'select' && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Payment Adapter Checkout</h3>
                <p className="text-xs text-slate-500">Booking ID #{booking.id} • Total: NPR {booking.total_amount}</p>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Select Unified Sandbox Payment Gateway (FR-06):
            </p>

            <div className="space-y-3 mb-8">
              {/* eSewa */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedGateway === 'esewa'
                    ? 'border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="gateway"
                    value="esewa"
                    checked={selectedGateway === 'esewa'}
                    onChange={() => setSelectedGateway('esewa')}
                    className="accent-emerald-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">eSewa Wallet Sandbox</span>
                    <span className="text-[11px] text-slate-500">Nepal's #1 Digital Wallet Sandbox API</span>
                  </div>
                </div>
                <span className="text-xs bg-emerald-600 text-white font-bold px-2 py-0.5 rounded">eSewa</span>
              </label>

              {/* Khalti */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedGateway === 'khalti'
                    ? 'border-purple-500 bg-purple-50/50 shadow-md ring-2 ring-purple-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="gateway"
                    value="khalti"
                    checked={selectedGateway === 'khalti'}
                    onChange={() => setSelectedGateway('khalti')}
                    className="accent-purple-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">Khalti Payment SDK</span>
                    <span className="text-[11px] text-slate-500">Instant Mobile Banking & Khalti Balance</span>
                  </div>
                </div>
                <span className="text-xs bg-purple-600 text-white font-bold px-2 py-0.5 rounded">Khalti</span>
              </label>

              {/* FonePay */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedGateway === 'fonepay'
                    ? 'border-rose-500 bg-rose-50/50 shadow-md ring-2 ring-rose-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="gateway"
                    value="fonepay"
                    checked={selectedGateway === 'fonepay'}
                    onChange={() => setSelectedGateway('fonepay')}
                    className="accent-rose-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block text-sm">FonePay QR Adapter</span>
                    <span className="text-[11px] text-slate-500">Interoperable Bank QR & Mobile App</span>
                  </div>
                </div>
                <span className="text-xs bg-rose-600 text-white font-bold px-2 py-0.5 rounded">FonePay</span>
              </label>
            </div>

            <button
              onClick={handleInitiate}
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              {loading ? 'Initiating Adapter Handshake...' : `Pay NPR ${booking.total_amount} via ${selectedGateway.toUpperCase()}`}
            </button>
          </div>
        )}

        {step === 'process' && (
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-md">
              eSewa
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">eSewa Sandbox Payment</h3>
            <p className="text-xs text-slate-500 mb-4">Transaction ID: <span className="font-mono text-slate-700 font-bold">{paymentDetails?.transactionId}</span></p>

            <div className="bg-stone-50 rounded-2xl p-4 mb-5 text-left border border-stone-200 text-xs space-y-3">
              <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-stone-200 font-bold">
                <span className="text-slate-600">Total Amount:</span>
                <span className="text-emerald-700 text-base">NPR {booking.total_amount}</span>
              </div>

              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 space-y-1">
                <p className="font-black text-emerald-900 text-[11px]">🔑 eSewa Sandbox Credentials:</p>
                <div className="text-[11px] text-emerald-800 font-mono space-y-0.5">
                  <p>eSewa ID: <span className="font-bold">9806800001</span> or <span className="font-bold">9806800002</span></p>
                  <p>Password: <span className="font-bold">Nepal@123</span> | MPIN: <span className="font-bold">1122</span></p>
                  <p>Merchant Code: <span className="font-bold">EPAYTEST</span></p>
                </div>
              </div>
            </div>

            {/* Official eSewa Sandbox Redirect Form */}
            {paymentDetails?.params && (
              <form action="https://uat.esewa.com.np/epay/main" method="POST" target="_blank" className="mb-3">
                <input type="hidden" name="amt" value={paymentDetails.params.amt} />
                <input type="hidden" name="pdc" value={paymentDetails.params.pdc || 0} />
                <input type="hidden" name="psc" value={paymentDetails.params.psc || 0} />
                <input type="hidden" name="txAmt" value={paymentDetails.params.txAmt || 0} />
                <input type="hidden" name="tAmt" value={paymentDetails.params.tAmt} />
                <input type="hidden" name="pid" value={paymentDetails.params.pid} />
                <input type="hidden" name="scd" value={paymentDetails.params.scd || 'EPAYTEST'} />
                <input type="hidden" name="su" value={paymentDetails.params.su} />
                <input type="hidden" name="fu" value={paymentDetails.params.fu} />

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mb-2"
                >
                  <span>Pay via eSewa Sandbox Portal (uat.esewa.com.np)</span>
                </button>
              </form>
            )}

            {/* 1-Click Instant Success Simulation */}
            <button
              onClick={handleVerifySimulation}
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Verifying Sandbox Transaction...' : 'Instant Auto-Approve & Confirm Booking'}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Booking Confirmed!</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto mb-6">
              Payment verified via {selectedGateway.toUpperCase()} sandbox adapter. Confirmation email dispatched via Nodemailer.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
            >
              Done & Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
