import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Phone, KeyRound, ShieldCheck, User, ArrowRight, LogOut,
  Mic, Map, Car, FileCheck, Plane, Compass, Heart, PhoneCall, 
  Gift, Shield, Landmark, HardDrive, BookOpen, 
  Wifi, ScanText, Store, QrCode, CheckCircle2
} from 'lucide-react';

// --- UPGRADE MODULE 1: DIGILOCKER SANDBOX ---
function DigiLockerSandbox() {
  const [authState, setAuthState] = useState('idle');
  const mockIssuedDocuments = [
    { id: 'aadhaar_01', type: 'Identity Record', issuer: 'UIDAI', status: 'Verified' },
    { id: 'dl_01', type: 'Driving License', issuer: 'Ministry of Road Transport', status: 'Verified' },
    { id: 'ssc_01', type: 'Class X Marksheet', issuer: 'State Board of Secondary Education', status: 'Verified' }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm max-w-xl mx-auto mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
          <Shield className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">DigiLocker DPI Portal Sandbox</h3>
          <p className="text-xs text-slate-500">Fetch official government records directly</p>
        </div>
      </div>

      {authState === 'idle' && (
        <button 
          onClick={() => { setAuthState('connecting'); setTimeout(() => setAuthState('complete'), 1200); }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition"
        >
          <span>Connect & Sync with DigiLocker</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}

      {authState === 'connecting' && (
        <p className="text-xs text-center text-blue-600 font-semibold py-4 animate-pulse">Establishing OAuth 2.0 Secure Handshake...</p>
      )}

      {authState === 'complete' && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-700">Verified Documents Retrieved:</p>
          {mockIssuedDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div>
                <p className="font-bold text-slate-800">{doc.type}</p>
                <p className="text-[10px] text-slate-500">{doc.issuer}</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">{doc.status}</span>
            </div>
          ))}
          <button onClick={() => setAuthState('idle')} className="text-[11px] text-blue-600 underline mt-2 block mx-auto">Reset Demo</button>
        </div>
      )}
    </div>
  );
}

// --- UPGRADE MODULE 2: VISION OCR AUTO-FILL ---
function OCRAutoFill() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', dob: '', state: '' });

  const handleUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setFormData({ fullName: 'Chethan Sai U', dob: '2000-05-12', state: 'Andhra Pradesh' });
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-purple-200 shadow-sm max-w-xl mx-auto mb-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
          <ScanText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">OCR Instant Form Auto-Fill</h3>
          <p className="text-xs text-slate-500">Scan certificate to populate fields automatically</p>
        </div>
      </div>

      <button onClick={handleUpload} className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2.5 rounded-xl font-semibold mb-4 transition">
        {isProcessing ? 'Processing Vision OCR Scanner...' : 'Simulate Certificate Scan'}
      </button>

      {formData.fullName && (
        <div className="space-y-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
          <div>
            <label className="block text-[10px] font-bold text-purple-700 uppercase">Extracted Name</label>
            <input type="text" value={formData.fullName} readOnly className="w-full text-xs border rounded-lg p-2 bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-purple-700 uppercase">Extracted DOB</label>
              <input type="text" value={formData.dob} readOnly className="w-full text-xs border rounded-lg p-2 bg-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-purple-700 uppercase">Extracted State</label>
              <input type="text" value={formData.state} readOnly className="w-full text-xs border rounded-lg p-2 bg-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- DYNAMIC KIOSK / AGENT MODE TOGGLE BAR ---
function KioskModeToggle({ isKioskMode, setIsKioskMode }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className={`p-4 rounded-2xl border transition-all mb-6 ${
      isKioskMode ? 'bg-amber-100 border-amber-300 shadow-sm' : 'bg-slate-100 border-slate-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isKioskMode ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 block">
              {isKioskMode ? 'CSC Agent / MeeSeva Operator View Active' : 'Standard Citizen View Mode Active'}
            </span>
            <span className="text-[10px] text-slate-500">
              {isKioskMode ? 'Agent Kiosk Tools: Bulk Processing, Counter Service, & Instant UPI Fee Collection' : 'Self-service direct access portal for individual citizens'}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setIsKioskMode(!isKioskMode)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            isKioskMode ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isKioskMode ? 'Switch to Citizen View' : 'Switch to CSC Agent View'}
        </button>
      </div>

      {isKioskMode && (
        <div className="mt-4 pt-3 border-t border-amber-200/80 flex flex-wrap gap-2 items-center">
          <span className="text-[11px] font-bold text-amber-900 mr-2">Agent Quick Actions:</span>
          <button 
            onClick={() => setShowPaymentModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-sm"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Collect Application Fee (UPI QR)</span>
          </button>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-xl">
            <h4 className="font-bold text-slate-900 mb-1">Collect Citizen Processing Fee</h4>
            <p className="text-xs text-slate-500 mb-4">Official Service Fee: ₹50.00</p>
            <div className="bg-slate-100 p-4 rounded-xl inline-block mb-4">
              <QrCode className="w-32 h-32 text-slate-800" />
            </div>
            <p className="text-[10px] text-slate-400 mb-4">Scan using BHIM, PhonePe, Paytm, or Google Pay</p>
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="w-full bg-slate-900 text-white text-xs py-2 rounded-xl font-medium"
            >
              Close Simulator
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --- AUTHENTICATION SYSTEM ---
function AuthSystem({ onAuthChange }) {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [userProfile, setUserProfile] = useState({ fullName: '', state: '', pincode: '' });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('js_user_session');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          setStep('authenticated');
          if (onAuthChange) onAuthChange(parsed);
        } catch (e) {
          localStorage.removeItem('js_user_session');
        }
      }
    }
  }, []);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phoneNumber.length === 10) {
      setStep('otp');
    } else {
      alert('Please enter a valid 10-digit Indian mobile number.');
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 4) {
      if (typeof window !== 'undefined') {
        const savedUser = localStorage.getItem('js_user_session');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          setCurrentUser(parsed);
          setStep('authenticated');
          if (onAuthChange) onAuthChange(parsed);
        } else {
          setStep('profile');
        }
      }
    } else {
      alert('Please enter 4-digit OTP (e.g. 1234).');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!userProfile.fullName || !userProfile.state) {
      alert('Please enter your full name and select your state.');
      return;
    }
    const userData = {
      phone: `+91 ${phoneNumber}`,
      fullName: userProfile.fullName,
      state: userProfile.state,
      pincode: userProfile.pincode,
      loggedInAt: new Date().toISOString()
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('js_user_session', JSON.stringify(userData));
    }
    setCurrentUser(userData);
    setStep('authenticated');
    if (onAuthChange) onAuthChange(userData);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('js_user_session');
    }
    setCurrentUser(null);
    setPhoneNumber('');
    setOtp('');
    setStep('phone');
    if (onAuthChange) onAuthChange(null);
  };

  return (
    <div className="w-full max-w-md mx-auto mb-6">
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
          </form>
        </div>
      )}

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
                placeholder="Chethan Sai U" 
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
                  required
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
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

// --- MAIN DASHBOARD COMPONENT ---
function DashboardContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [currentUser, setCurrentUser] = useState(null);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      
      {/* Header & Auth */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">JanSahayak Civic Portal</h1>
            <p className="text-xs text-slate-500">Unified Indian E-Governance & Administrative Hub</p>
          </div>
        </div>

        <AuthSystem onAuthChange={(user) => setCurrentUser(user)} />
      </div>

      {/* DASHBOARD CONTENT (Renders only when logged in) */}
      {currentUser && (
        <>
          <div className="max-w-7xl mx-auto">
            <KioskModeToggle isKioskMode={isKioskMode} setIsKioskMode={setIsKioskMode} />
          </div>

          <div className="max-w-7xl mx-auto mb-6 flex space-x-2 border-b border-slate-200 pb-2 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition ${activeTab === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              All 18 Features (15 Core + 3 Upgrades)
            </button>
            <button 
              onClick={() => setActiveTab('digilocker')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition ${activeTab === 'digilocker' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              DigiLocker DPI Engine
            </button>
            <button 
              onClick={() => setActiveTab('ocr')}
              className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition ${activeTab === 'ocr' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Vision OCR Auto-Fill
            </button>
          </div>

          <div className="max-w-7xl mx-auto">
            {activeTab === 'digilocker' && <DigiLockerSandbox />}
            {activeTab === 'ocr' && <OCRAutoFill />}

            {activeTab === 'all' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* UPGRADE 1 */}
                <div className={`p-5 rounded-xl border shadow-sm transition ${isKioskMode ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-blue-200'}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg"><Shield className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 text-sm">[UPGRADE] DigiLocker DPI Engine</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Pull government-verified records directly using Digital India sandbox API.</p>
                  <button onClick={() => setActiveTab('digilocker')} className={`w-full text-xs py-2 rounded-lg font-semibold transition ${isKioskMode ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {isKioskMode ? 'Agent Bulk Connect DigiLocker' : 'Connect DigiLocker'}
                  </button>
                </div>

                {/* UPGRADE 2 */}
                <div className={`p-5 rounded-xl border shadow-sm transition ${isKioskMode ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-purple-200'}`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg"><ScanText className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 text-sm">[UPGRADE] Vision OCR Auto-Fill</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">Extract textual fields from scanned documents automatically into forms.</p>
                  <button onClick={() => setActiveTab('ocr')} className={`w-full text-xs py-2 rounded-lg font-semibold transition ${isKioskMode ? 'bg-amber-600 text-white' : 'bg-purple-600 text-white'}`}>
                    {isKioskMode ? 'Agent High-Speed Batch OCR' : 'Scan & Auto-Fill'}
                  </button>
                </div>

                {/* UPGRADE 3 */}
                <div className="bg-white p-5 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg"><Store className="w-5 h-5" /></div>
                    <h3 className="font-bold text-slate-900 text-sm">[UPGRADE] CSC Agent Portal</h3>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">MeeSeva kiosk operator tools with instant UPI payment processing.</p>
                  <button onClick={() => setIsKioskMode(!isKioskMode)} className="w-full text-xs py-2 rounded-lg font-semibold bg-amber-50 border border-amber-200 text-amber-800">
                    Toggle Kiosk Mode ({isKioskMode ? 'ON' : 'OFF'})
                  </button>
                </div>

                {/* CORE FEATURES 1-15 */}
                {[
                  { id: '1', title: '1. Multilingual Voice Assistant', desc: 'Voice & text portal for 200+ Indian regional languages.', icon: Mic },
                  { id: '2', title: '2. Step-by-Step Guided Wizards', desc: 'Decision-tree workflows for administrative updates.', icon: Map },
                  { id: '3', title: '3. Parivahan & DL Hub', desc: "Learner's license, permanent DL, and vehicle renewal.", icon: Car },
                  { id: '4', title: '4. Educational Document Verifier', desc: 'Board & University certificate authentication.', icon: FileCheck },
                  { id: '5', title: '5. Passport Seva Guided Workflow', desc: 'Annexure creation, checklists, and slot booking.', icon: Plane },
                  { id: '6', title: '6. Smart Visa Guidance Engine', desc: 'Overseas documentation & ECR/ECNR passport routing.', icon: Compass },
                  { id: '7', title: '7. Vital Records Portal', desc: 'Birth, Death, and Marriage certificate requests.', icon: Heart },
                  { id: '8', title: '8. Emergency SOS Hotline', desc: 'One-tap triggers for 112, Women Helpline, & utilities.', icon: PhoneCall },
                  { id: '9', title: '9. Welfare Scheme Matchmaker', desc: 'Filter government welfare schemes by income and age.', icon: Gift },
                  { id: '10', title: '10. Anonymous Grievance Portal', desc: 'Encrypted report filing directly to anti-corruption units.', icon: Shield },
                  { id: '11', title: '11. Universal MRO Portal', desc: 'Income, Caste, Residence, and Nativity applications.', icon: Landmark },
                  { id: '12', title: '12. Pre-Submission AI Authenticator', desc: 'Check blur, structural compliance, and missing seals.', icon: HardDrive },
                  { id: '13', title: '13. Secure Document Vault', desc: 'Local and cloud encrypted persistence vault.', icon: HardDrive },
                  { id: '14', title: '14. Status Code Translator', desc: 'Decode bureaucratic rejection codes into simple advice.', icon: BookOpen },
                  { id: '15', title: '15. Data Saver Mode', desc: 'High-contrast, low-bandwidth mode for 2G/3G connections.', icon: Wifi }
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <div key={item.id} className={`p-5 rounded-xl border shadow-sm transition ${isKioskMode ? 'bg-amber-50/40 border-amber-300' : 'bg-white border-slate-200'}`}>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2.5 bg-slate-100 text-slate-700 rounded-lg"><IconComp className="w-5 h-5" /></div>
                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mb-4">{item.desc}</p>
                      <button 
                        onClick={() => setActiveModal(item)}
                        className={`w-full text-xs py-2 rounded-lg font-semibold transition ${isKioskMode ? 'bg-amber-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                      >
                        {isKioskMode ? `Agent Action: ${item.title.split('.')[1]}` : 'Launch Feature Module'}
                      </button>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* DYNAMIC MODAL POPUP FOR CORE FEATURES */}
          {activeModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <activeModal.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{activeModal.title}</h3>
                    <p className="text-xs text-slate-500">JanSahayak Module Connected</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 text-xs space-y-2">
                  <p className="font-semibold text-slate-700">{activeModal.desc}</p>
                  <div className="flex items-center space-x-2 text-emerald-600 pt-2 border-t border-slate-200">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-medium text-[11px]">System Status: Online & Synchronized</span>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveModal(null)}
                  className="w-full bg-indigo-600 text-white text-xs py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Close & Return to Hub
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Disable SSR to fix Netlify / Vercel client hydration state issues
export default dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
});