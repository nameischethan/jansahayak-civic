import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  Phone, KeyRound, ShieldCheck, User, ArrowRight, LogOut,
  Mic, Map, Car, FileCheck, Plane, Compass, Heart, PhoneCall, 
  Gift, Shield, Landmark, HardDrive, BookOpen, 
  Wifi, ScanText, Store, QrCode, ExternalLink, CheckCircle2, ChevronRight, FileText
} from 'lucide-react';

// --- FEATURE MODULE ROADMAP DATA ENGINE ---
const FEATURE_ROADMAPS = {
  '1': {
    title: 'Multilingual Voice Assistant',
    subtitle: 'Voice-guided e-Governance navigation in 200+ Indian regional languages.',
    portalUrl: 'https://bhashini.gov.in/',
    portalName: 'Bhashini AI Portal',
    steps: [
      { title: 'Step 1: Select Native Language', desc: 'Choose from 22 official languages (Hindi, Telugu, Tamil, Kannada, Bengali, etc.).' },
      { title: 'Step 2: Voice / Text Prompting', desc: 'Speak or type your administrative query (e.g., "How to apply for Ration Card?").' },
      { title: 'Step 3: AI Translation & Routing', desc: 'Bhashini engine parses dialect and routes you directly to the relevant state service page.' }
    ],
    documents: ['No documents required for voice navigation inquiry.'],
    fee: 'Free Public Service'
  },
  '2': {
    title: 'Step-by-Step Guided Wizards',
    subtitle: 'Decision-tree workflow for complex administrative updates.',
    portalUrl: 'https://services.india.gov.in/',
    portalName: 'National Services Portal',
    steps: [
      { title: 'Step 1: Administrative Needs Assessment', desc: 'Select task: Address Change, Name Update, or Family Additions.' },
      { title: 'Step 2: Cross-Portal Document Pre-Check', desc: 'Interactive checklist verifies if your supporting IDs match across state databases.' },
      { title: 'Step 3: Unified Form Generation', desc: 'Generates pre-filled PDF application accepted by local Tehsil / MeeSeva counters.' }
    ],
    documents: ['Existing Aadhaar Card', 'Utility Bill (Electricity/Water)', 'Rent Agreement or Property Deed'],
    fee: 'Free Guidance'
  },
  '3': {
    title: 'Parivahan & Driving License Hub',
    subtitle: 'End-to-End Driving License (DL) & Vehicle Registration Roadmap.',
    portalUrl: 'https://parivahan.gov.in/',
    portalName: 'Parivahan Sewa Portal',
    steps: [
      { title: 'Step 1: Apply for Learner\'s License (LL)', desc: 'Submit Form 2 online on Parivahan, upload Aadhaar, and clear the online Road Safety Quiz.' },
      { title: 'Step 2: Practice Period (30 Days)', desc: 'Hold Learner\'s License for a mandatory 30-day period before scheduling driving track test.' },
      { title: 'Step 3: Book RTO Slot & Practical Test', desc: 'Schedule slot via Sarathi portal, pay ₹200 fee, and present vehicle at RTO for test.' },
      { title: 'Step 4: Smart Card DL Issuance', desc: 'Upon clearing driving test, Smart Card DL is dispatched via Speed Post in 7-14 days.' }
    ],
    documents: ['Aadhaar Card (Age & Address Proof)', 'Form 1A Medical Fitness Certificate (if age > 40)', 'Passport Size Photographs'],
    fee: '₹200 (LL Test) + ₹300 (Permanent DL Test) + ₹200 (Smart Card Fee)'
  },
  '4': {
    title: 'Educational Document Verifier',
    subtitle: 'Verify Class X, XII, and University marksheets via NAD / DigiLocker.',
    portalUrl: 'https://nad.digilocker.gov.in/',
    portalName: 'National Academic Depository',
    steps: [
      { title: 'Step 1: Input Educational Roll Number', desc: 'Enter Roll Number, Board (CBSE, ICSE, State Board), and Passing Year.' },
      { title: 'Step 2: Direct Board API Lookup', desc: 'Authenticates record directly against central board servers.' },
      { title: 'Step 3: Issue PKI Signed Certificate', desc: 'Downloads tamper-proof digitally signed marksheet PDF.' }
    ],
    documents: ['Admit Card / Roll Number', 'Aadhaar Number linked with Mobile'],
    fee: 'Free'
  },
  '5': {
    title: 'Passport Seva Guided Workflow',
    subtitle: 'Fresh Passport application & Slot Booking roadmap.',
    portalUrl: 'https://www.passportindia.gov.in/',
    portalName: 'Passport Seva Official Site',
    steps: [
      { title: 'Step 1: Register on Passport Portal', desc: 'Create user account and select your nearest Passport Seva Kendra (PSK).' },
      { title: 'Step 2: Fill Application & Pay Fee', desc: 'Complete Online Form (Normal or Tatkaal) and pay ₹1,500 fee online.' },
      { title: 'Step 3: PSK Appointment & Verification', desc: 'Visit PSK for biometrics & photo capture with original physical documents.' },
      { title: 'Step 4: Police Verification (PV)', desc: 'Local police station verifies residency details before final passport dispatch.' }
    ],
    documents: ['Aadhaar Card', 'PAN Card / Voter ID', 'Birth Certificate / Class X Marksheet'],
    fee: '₹1,500 (Normal - 36 Pages) / ₹3,500 (Tatkaal)'
  },
  '6': {
    title: 'Smart Visa Guidance Engine',
    subtitle: 'Overseas visa requirements, document translation, and ECR/ECNR clearance.',
    portalUrl: 'https://emigrate.gov.in/',
    portalName: 'eMigrate India Portal',
    steps: [
      { title: 'Step 1: Select Destination Country', desc: 'Check visa category (Tourist, Student, Work) and ECR/ECNR status.' },
      { title: 'Step 2: Document Attestation Checklist', desc: 'Get degree certificates attested by MEA (Ministry of External Affairs) if required.' },
      { title: 'Step 3: Embassy / VFS Slot Booking', desc: 'Submit application via official VFS Global or Embassy portal.' }
    ],
    documents: ['Valid Passport (Min 6 months validity)', 'Bank Statements (6 months)', 'Flight & Hotel Bookings'],
    fee: 'Varies by destination country'
  },
  '7': {
    title: 'Vital Records Portal',
    subtitle: 'Roadmap to obtain Birth, Death, and Marriage Certificates.',
    portalUrl: 'https://crsorgi.gov.in/',
    portalName: 'Civil Registration System (CRS)',
    steps: [
      { title: 'Step 1: Hospital / Gram Panchayat Filing', desc: 'Ensure event registration within 21 days of birth or death.' },
      { title: 'Step 2: Online Search on CRS Portal', desc: 'Locate registration number using date and institutional location.' },
      { title: 'Step 3: Digital Download or Doorstep Delivery', desc: 'Download QR-verified digital certificate instantly.' }
    ],
    documents: ['Hospital Discharge Summary / Death Note', 'Parents/Spouse Aadhaar Card'],
    fee: 'Free within 21 days / ₹20-₹100 for delayed filing'
  },
  '8': {
    title: 'Emergency SOS Hotline',
    subtitle: 'Unified emergency response dispatch hub.',
    portalUrl: 'https://112.gov.in/',
    portalName: 'National Emergency Response System (112)',
    steps: [
      { title: 'Police / Fire / Ambulance', desc: 'Dial 112 for instant unified emergency response.' },
      { title: 'Women Helpline', desc: 'Dial 1091 for emergency women safety assistance.' },
      { title: 'Cyber Crime Emergency', desc: 'Dial 1930 to freeze fraudulent financial transactions.' }
    ],
    documents: ['No documentation needed for emergency dispatch.'],
    fee: 'Toll Free (24/7 Service)'
  },
  '9': {
    title: 'Welfare Scheme Matchmaker',
    subtitle: 'Find eligible central & state government welfare schemes.',
    portalUrl: 'https://www.myscheme.gov.in/',
    portalName: 'myScheme Central Portal',
    steps: [
      { title: 'Step 1: Enter Demographics', desc: 'Input Age, Gender, Income level, Category, and State of residence.' },
      { title: 'Step 2: AI Eligibility Screening', desc: 'System filters 2,000+ schemes down to ones you qualify for (e.g., PM-KISAN, PMAY).' },
      { title: 'Step 3: One-Click Direct Application', desc: 'Routes directly to official scheme enrollment portal with pre-verified details.' }
    ],
    documents: ['Income Certificate', 'Caste/Category Certificate (if applicable)', 'Aadhaar Card'],
    fee: 'Free Public Service'
  },
  '10': {
    title: 'Anonymous Grievance Portal',
    subtitle: 'Encrypted administrative complaint filing.',
    portalUrl: 'https://pgportal.gov.in/',
    portalName: 'CPGRAMS Central Portal',
    steps: [
      { title: 'Step 1: Select Ministry / Department', desc: 'Choose targeted central ministry, public sector unit, or state department.' },
      { title: 'Step 2: Attach Evidence & Statement', desc: 'Upload documents or photos describing the grievance.' },
      { title: 'Step 3: Track Real-Time Resolution', desc: 'Receive unique registration number to track action within 30 days.' }
    ],
    documents: ['Proof of Complaint / Correspondence / Receipts'],
    fee: 'Free'
  },
  '11': {
    title: 'Universal MRO Portal',
    subtitle: 'Income, Caste, Residence, and Nativity Certificate application.',
    portalUrl: 'https://services.india.gov.in/',
    portalName: 'State Revenue Services (MRO/Tahsildar)',
    steps: [
      { title: 'Step 1: Select Revenue Service', desc: 'Choose required certificate (Income, Caste, Residence, EWS).' },
      { title: 'Step 2: Local VRO Inspection', desc: 'Application is routed to Village Revenue Officer (VRO) for field verification.' },
      { title: 'Step 3: MRO Digital Signature & Download', desc: 'Tahsildar signs certificate digitally; download PDF via MeeSeva / Seva Sindhu.' }
    ],
    documents: ['Aadhaar Card', 'Ration Card', 'Self-Declaration Form', 'Salary Slips / Property Tax Receipt'],
    fee: '₹35 - ₹50'
  },
  '12': {
    title: 'Pre-Submission AI Authenticator',
    subtitle: 'Scan documents for blur, compliance, missing stamps, and signature validity.',
    portalUrl: 'https://uidai.gov.in/',
    portalName: 'Digital India Document AI Standards',
    steps: [
      { title: 'Step 1: Upload Document Image', desc: 'Upload JPG or PDF scan of your certificate.' },
      { title: 'Step 2: Computer Vision Audit', desc: 'Scans for resolution > 300 DPI, missing gazetted stamps, and clear signatures.' },
      { title: 'Step 3: Compliance Pass/Fail Report', desc: 'Highlights missing fields to prevent application rejection by officers.' }
    ],
    documents: ['PDF/Image of document to be checked'],
    fee: 'Free Tool'
  },
  '13': {
    title: 'Secure Document Vault',
    subtitle: 'AES-256 encrypted local & cloud document storage for government IDs.',
    portalUrl: 'https://www.digilocker.gov.in/',
    portalName: 'DigiLocker Personal Cloud',
    steps: [
      { title: 'Step 1: Encrypted Storage Allocation', desc: 'Allocates 1GB biometric-secured cloud storage.' },
      { title: 'Step 2: Categorized Auto-Sorting', desc: 'Automatically organizes uploaded PDFs into Identity, Tax, and Education folders.' },
      { title: 'Step 3: Quick Share Links', desc: 'Generate 15-minute secure QR links for counter verification.' }
    ],
    documents: ['Any official PDF or image document'],
    fee: 'Free'
  },
  '14': {
    title: 'Status Code Translator',
    subtitle: 'Decode rejection codes into actionable resolution steps.',
    portalUrl: 'https://uidai.gov.in/',
    portalName: 'JanSahayak Bureaucratic Code AI',
    steps: [
      { title: 'Step 1: Paste Rejection Code', desc: 'Enter code from SMS/Portal (e.g., "ERR_ADDR_MISMATCH_04").' },
      { title: 'Step 2: Plain Language Translation', desc: 'Translates technical jargon: "Your address proof does not match your pin code."' },
      { title: 'Step 3: Fix Checklist', desc: 'Provides immediate corrective action steps to resubmit successfully.' }
    ],
    documents: ['Rejection Notice / Application Number'],
    fee: 'Free Tool'
  },
  '15': {
    title: 'Data Saver Mode',
    subtitle: 'Ultra low-bandwidth text-only portal optimized for 2G/3G connectivity.',
    portalUrl: 'https://web.umang.gov.in/',
    portalName: 'UMANG Lite Portal',
    steps: [
      { title: 'Step 1: Strip Heavy Assets', desc: 'Disables high-res imagery, videos, and heavy scripts.' },
      { title: 'Step 2: Compressed API Handshake', desc: 'Reduces data payload per request to under 15 KB.' },
      { title: 'Step 3: Offline Draft Cache', desc: 'Saves form data locally if connection drops in rural areas.' }
    ],
    documents: ['None'],
    fee: 'Free Mode'
  }
};

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
  const [selectedFeatureId, setSelectedFeatureId] = useState(null);

  const activeRoadmap = selectedFeatureId ? FEATURE_ROADMAPS[selectedFeatureId] : null;

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
                        onClick={() => setSelectedFeatureId(item.id)}
                        className={`w-full text-xs py-2 rounded-lg font-semibold flex items-center justify-center space-x-1 transition ${isKioskMode ? 'bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                      >
                        <span>View Step-by-Step Roadmap</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

              </div>
            )}
          </div>

          {/* DETAILED ROADMAP MODAL POPUP */}
          {activeRoadmap && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
                
                {/* Modal Header */}
                <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500 text-white px-2 py-0.5 rounded">Official Service Guide</span>
                    <h3 className="font-bold text-lg mt-1">{activeRoadmap.title}</h3>
                    <p className="text-xs text-slate-300">{activeRoadmap.subtitle}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedFeatureId(null)}
                    className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="p-6 overflow-y-auto space-y-6">
                  
                  {/* Step-by-Step Process */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1">
                      <ChevronRight className="w-4 h-4 text-indigo-600" />
                      <span>Application Roadmap & Procedure</span>
                    </h4>
                    <div className="space-y-3">
                      {activeRoadmap.steps.map((step, idx) => (
                        <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-start space-x-3">
                          <span className="bg-indigo-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{step.title}</p>
                            <p className="text-[11px] text-slate-600 mt-0.5">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Required Documents Checklist */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>Required Supporting Documents</span>
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {activeRoadmap.documents.map((doc, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-xs text-slate-700 bg-emerald-50/60 border border-emerald-100 p-2.5 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Fee Structure */}
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-900">Estimated Official Fee:</span>
                    <span className="font-semibold text-amber-800 bg-white px-2.5 py-1 rounded-md border border-amber-300">{activeRoadmap.fee}</span>
                  </div>

                </div>

                {/* Modal Footer (Direct Portal Redirect) */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedFeatureId(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
                  >
                    Back to Hub
                  </button>

                  <a 
                    href={activeRoadmap.portalUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition shadow-md"
                  >
                    <span>Proceed to Official {activeRoadmap.portalName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Disable SSR to prevent Netlify hydration errors
export default dynamic(() => Promise.resolve(DashboardContent), {
  ssr: false,
});