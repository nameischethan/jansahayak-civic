import React, { useState } from 'react';
import { ScanText, UploadCloud, CheckCircle, Loader2 } from 'lucide-react';

export default function OCRAutoFill() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    fatherName: '',
    state: ''
  });
  const [scanComplete, setScanComplete] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    setScanComplete(false);

    // Simulated Intelligent OCR Processing Engine
    setTimeout(() => {
      setFormData({
        fullName: 'Ramesh Kumar',
        dob: '1995-08-14',
        fatherName: 'Suresh Kumar',
        state: 'Telangana'
      });
      setIsProcessing(false);
      setScanComplete(true);
    }, 1800);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
          <ScanText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">OCR Instant Application Auto-Fill</h3>
          <p className="text-xs text-slate-500">Scan certificate to automatically complete forms</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="border-2 border-dashed border-slate-300 hover:border-purple-400 rounded-xl p-4 text-center cursor-pointer transition mb-4 relative">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        />
        <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-1" />
        <p className="text-xs font-semibold text-slate-700">Upload Certificate Scan</p>
        <p className="text-[10px] text-slate-400">PNG, JPG or PDF up to 5MB</p>
      </div>

      {isProcessing && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-xs text-purple-700 font-medium">Extracting textual fields via Vision OCR...</span>
        </div>
      )}

      {scanComplete && (
        <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 p-2.5 rounded-xl text-xs font-medium mb-4">
          <CheckCircle className="w-4 h-4" />
          <span>Form fields automatically populating below:</span>
        </div>
      )}

      {/* Dynamic Auto-Filled Form */}
      <div className="space-y-3">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Full Legal Name</label>
          <input 
            type="text" 
            value={formData.fullName} 
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Parsed Name" 
            className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">Date of Birth</label>
            <input 
              type="date" 
              value={formData.dob} 
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">State / Region</label>
            <input 
              type="text" 
              value={formData.state} 
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}