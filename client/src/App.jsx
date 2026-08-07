import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import HomestayList from './pages/HomestayList';
import HomestayDetail from './pages/HomestayDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import CultureGuidePage from './pages/CultureGuidePage';
import AIPlannerPage from './pages/AIPlannerPage';
import MyBookingsPage from './pages/MyBookingsPage';
import HostDashboard from './pages/HostDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SUSAEvaluationPage from './pages/SUSAEvaluationPage';
import PaymentCallback from './pages/PaymentCallback';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 font-sans selection:bg-rose-600 selection:text-white w-full overflow-x-hidden">
            <Navbar />
            <main className="flex-grow w-full overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/homestays" element={<HomestayList />} />
                <Route path="/homestays/:id" element={<HomestayDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/culture" element={<CultureGuidePage />} />
                <Route path="/ai-planner" element={<AIPlannerPage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/payment-callback" element={<PaymentCallback />} />
                <Route path="/recommendations" element={<Home />} />
                <Route path="/host" element={<HostDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/sus-evaluation" element={<SUSAEvaluationPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
