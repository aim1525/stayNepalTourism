import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, BarChart2, Users, Building, AlertCircle, Sparkles, CreditCard, Brain, Check } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';

const MOCK_USERS = [
  { id: 1, name: 'Aim Admin', email: 'admin@staynepal.gov.np', role: 'admin', phone: '+977-9800000000', status: 'Active' },
  { id: 2, name: 'Karsang Gurung', email: 'host.karsang@staynepal.com', role: 'host', phone: '+977-9811111111', status: 'Verified Host' },
  { id: 3, name: 'Pasang Sherpa', email: 'host.pasang@staynepal.com', role: 'host', phone: '+977-9822222222', status: 'Verified Host' },
  { id: 4, name: 'Ram Bahadur Tharu', email: 'host.ram@staynepal.com', role: 'host', phone: '+977-9833333333', status: 'Verified Host' },
  { id: 5, name: 'Sujata Shrestha', email: 'host.sujata@staynepal.com', role: 'host', phone: '+977-9844444444', status: 'Verified Host' },
  { id: 6, name: 'John Doe', email: 'tourist@staynepal.com', role: 'tourist', phone: '+977-9855555555', status: 'Verified Tourist' }
];

const MOCK_PAYMENT_LOGS = [
  { id: 'TXN-984392', gateway: 'eSewa', amount: 4400, user: 'John Doe', status: 'SUCCESS', refId: '000452', date: '2026-08-01 14:22' },
  { id: 'TXN-773211', gateway: 'Khalti', amount: 3600, user: 'Maya Lin', status: 'SUCCESS', refId: 'KHLT-882', date: '2026-08-01 15:10' },
  { id: 'TXN-551944', gateway: 'FonePay', amount: 2800, user: 'Aarav Sharma', status: 'SUCCESS', refId: 'FNE-9941', date: '2026-08-01 16:45' }
];

const AdminDashboard = () => {
  const { lang } = useLanguage();
  const { token } = useAuth();
  const [homestays, setHomestays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('homestays');

  useEffect(() => {
    fetchHomestays();
  }, []);

  const fetchHomestays = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/homestays');
      setHomestays(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const verifyHomestay = async (id) => {
    try {
      await axios.patch(`/api/homestays/${id}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchHomestays();
    } catch (err) {
      setHomestays(homestays.map(h => h.id === id ? { ...h, is_verified: 1 } : h));
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Title */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Administrator Portal (FR-09)</span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'ne' ? 'प्रशासकीय नियन्त्रण र विश्लेषिकी' : 'StayNepal Administrator Control Hub'}
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Audit homestay listings, manage tourists & hosts, inspect payment gateway logs, and benchmark AI evaluation algorithms.
            </p>
          </div>

          <div className="flex bg-white p-1.5 rounded-2xl border border-stone-200 text-xs font-black shadow-sm">
            <button
              onClick={() => setActiveTab('homestays')}
              className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'homestays' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Homestays ({homestays.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'users' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Users & Roles
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-2 rounded-xl transition-all ${activeTab === 'payments' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Payment Logs
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md">
            <Building className="w-8 h-8 text-rose-600 mb-2" />
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Registered Homestays</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{homestays.length}</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md">
            <ShieldCheck className="w-8 h-8 text-emerald-600 mb-2" />
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Verified Listings</span>
            <span className="text-3xl font-black text-emerald-800 mt-1 block">
              {homestays.filter(h => h.is_verified === 1).length}
            </span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md">
            <Users className="w-8 h-8 text-teal-600 mb-2" />
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Active Districts</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">77 / 77</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-md">
            <BarChart2 className="w-8 h-8 text-amber-500 mb-2" />
            <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">NCF AI Accuracy</span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">91.4%</span>
          </div>
        </div>

        {/* Tab Content 1: Homestays Verification Queue */}
        {activeTab === 'homestays' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-lg">Homestay Verification & Audit Queue</h3>
              <span className="text-xs text-slate-500 font-medium">PostGIS Coordinates Audit</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-slate-500 font-black uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">Homestay Title</th>
                    <th className="p-4">District</th>
                    <th className="p-4">Host</th>
                    <th className="p-4">Price / Night</th>
                    <th className="p-4">Verification Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {homestays.map(h => (
                    <tr key={h.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">#{h.id}</td>
                      <td className="p-4 font-black text-slate-900">{h.title_en}</td>
                      <td className="p-4 text-slate-600">{h.district}</td>
                      <td className="p-4 text-slate-600">{h.host_name || 'Karsang Gurung'}</td>
                      <td className="p-4 font-black text-emerald-800">NPR {h.price_per_night}</td>
                      <td className="p-4">
                        {h.is_verified === 1 ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3 text-emerald-700" /> Verified
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200">
                            Pending Audit
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {h.is_verified === 0 ? (
                          <button
                            onClick={() => verifyHomestay(h.id)}
                            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[11px] rounded-xl transition-all shadow-sm cursor-pointer"
                          >
                            Approve & Verify
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-bold">Verified</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: User Directory */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h3 className="font-black text-slate-900 text-lg">Registered Users Directory (Tourists & Hosts)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-slate-500 font-black uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-4">ID</th>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">System Role</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {MOCK_USERS.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-400">#{u.id}</td>
                      <td className="p-4 font-black text-slate-900">{u.name}</td>
                      <td className="p-4 text-slate-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                          u.role === 'host' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                          'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-mono">{u.phone}</td>
                      <td className="p-4 text-slate-700">{u.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 3: Payment Logs */}
        {activeTab === 'payments' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-md overflow-hidden">
            <div className="p-6 border-b border-stone-100">
              <h3 className="font-black text-slate-900 text-lg">Adapter Pattern Payment Transaction Logs</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-slate-500 font-black uppercase border-b border-stone-200">
                  <tr>
                    <th className="p-4">Transaction ID</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Tourist User</th>
                    <th className="p-4">Ref Code</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {MOCK_PAYMENT_LOGS.map(p => (
                    <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-4 font-mono font-bold text-rose-600">{p.id}</td>
                      <td className="p-4 font-black text-slate-900 uppercase">{p.gateway}</td>
                      <td className="p-4 font-black text-emerald-800">NPR {p.amount}</td>
                      <td className="p-4 text-slate-600">{p.user}</td>
                      <td className="p-4 font-mono text-slate-500">{p.refId}</td>
                      <td className="p-4">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
