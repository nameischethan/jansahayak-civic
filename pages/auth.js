import React, { useState, useEffect } from 'react';
import { Phone, KeyRound, ShieldCheck, User, ArrowRight, LogOut, CheckCircle } from 'lucide-react';

export default function AuthSystem({ onAuthChange }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'profile' | 'authenticated'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userProfile, setUserProfile] = useState({ fullName: '', state: 'Telangana', pincode: '' });
  const [currentUser, setCurrentUser] = useState(null);

  // Check existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('js_user_session');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setCurrentUser(parsed);
      setStep('authenticated');
      if (onAuthChange) onAuthChange(parsed);
    }
  }, []);

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setStep('otp');
    } else {
      alert('Please enter a valid 10-digit Indian mobile number.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      // Check if returning user or new user
      const savedUser = localStorage.getItem('js_user_session');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        setStep('authenticated');
        if (onAuthChange) onAuthChange(parsed);
      } else {
        setStep('profile'); // Send new user to complete quick profile
      }
    } else {
      alert('Please enter a 4-digit OTP (e.g., 1234).');
    }
  };

  // Step 3: Complete Profile & Save Session
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!userProfile.fullName) {
      alert('Please enter your full name.');
      return;
    }

    const userData = {
      phone: `+91 ${phoneNumber}`,
      fullName: userProfile.fullName,
      state: userProfile.state,
      pincode: userProfile.pincode,
      loggedInAt: new Date().toISOString()
    };

    localStorage.setItem('js_user_session', JSON.stringify(userData));
    setCurrentUser(userData);
    setStep('authenticated');
    if (onAuthChange) onAuthChange(userData);
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('js_user_session');
    setCurrentUser(null);
    setPhoneNumber('');
    setOtp('');
    setStep('phone');
    if (onAuthChange) onAuthChange(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      
      {/* 1. Phone Number Step */}
      {step === 'phone' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Citizen Sign In / Sign Up</h3>
              <p className="text-xs text-slate-500">OTP-based secure portal access</p>
            </div>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Mobile Phone Number</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-xs font-semibold text-slate-500 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl">+91</span>
                <input 
                  type="tel" 
                  maxLength="10"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210" 
                  className="flex-1 border border-slate-300 rounded-r-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition"
            >
              <span>Send Verification OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 2. OTP Verification Step */}
      {step === 'otp' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Enter Verification Code</h3>
              <p className="text-xs text-slate-500">Sent to +91 {phoneNumber}</p>
            </div>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">4-Digit One-Time Password</label>
              <input 
                type="text" 
                maxLength="4"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="1234" 
                className="w-full border border-slate-300 rounded-xl p-2.5 text-center text-lg tracking-widest font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
              <p className="text-[10px] text-slate-400 mt-1 text-center">Enter <strong>1234</strong> for quick demo access</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition"
            >
              Verify & Proceed
            </button>

            <button 
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-xs text-slate-500 hover:underline"
            >
              Change Mobile Number
            </button>
          </form>
        </div>
      )}

      {/* 3. New User Profile Setup Step */}
      {step === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Complete Citizen Profile</h3>
              <p className="text-xs text-slate-500">First-time profile configuration</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Full Name</label>
              <input 
                type="text" 
                value={userProfile.fullName}
                onChange={(e) => setUserProfile({ ...userProfile, fullName: e.target.value })}
                placeholder="Ramesh Kumar" 
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">State</label>
                <select 
                  value={userProfile.state}
                  onChange={(e) => setUserProfile({ ...userProfile, state: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="Telangana">Telangana</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Pincode</label>
                <input 
                  type="text" 
                  maxLength="6"
                  value={userProfile.pincode}
                  onChange={(e) => setUserProfile({ ...userProfile, pincode: e.target.value.replace(/\D/g, '') })}
                  placeholder="500001" 
                  className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition mt-2"
            >
              Save Profile & Access Dashboard
            </button>
          </form>
        </div>
      )}

      {/* 4. Authenticated Session Card */}
      {step === 'authenticated' && currentUser && (
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900">{currentUser.fullName || 'Authenticated Citizen'}</p>
              <p className="text-[10px] text-emerald-700 font-medium">{currentUser.phone} • {currentUser.state || 'India'}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-1 text-xs text-red-600 bg-white hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      )}

    </div>
  );
}