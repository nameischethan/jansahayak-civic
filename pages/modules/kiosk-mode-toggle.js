import React, { useState } from 'react';
import { User, Store, QrCode } from 'lucide-react';

export default function KioskModeToggle() {
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {isKioskMode ? <Store className="w-5 h-5 text-amber-600" /> : <User className="w-5 h-5 text-indigo-600" />}
          <span className="text-xs font-bold text-slate-800">
            {isKioskMode ? 'Agent Mode (MeeSeva / CSC Center)' : 'Citizen Portal Mode'}
          </span>
        </div>
        <button 
          onClick={() => setIsKioskMode(!isKioskMode)}
          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
            isKioskMode ? 'bg-amber-600 text-white' : 'bg-slate-300 text-slate-700'
          }`}
        >
          {isKioskMode ? 'Switch to Citizen View' : 'Switch to CSC Agent View'}
        </button>
      </div>

      {isKioskMode && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs space-y-2">
          <p className="font-semibold text-amber-900">Kiosk Assisted Application Tools:</p>
          <div className="flex space-x-2">
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Collect Citizen Fee via UPI</span>
            </button>
          </div>
        </div>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center">
            <h4 className="font-bold text-slate-900 mb-1">Collect Government Processing Fee</h4>
            <p className="text-xs text-slate-500 mb-4">Official Application Fee: ₹50.00</p>
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