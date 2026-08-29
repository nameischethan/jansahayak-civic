import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, CheckCircle2, FileText, Loader2 } from 'lucide-react';

export default function DigiLockerSandbox({ onDocumentFetched }) {
  const [authState, setAuthState] = useState('idle'); // idle | connecting | authenticated | fetching | complete
  const [fetchedDocs, setFetchedDocs] = useState([]);

  const mockIssuedDocuments = [
    { id: 'aadhaar_01', type: 'Aadhaar Card', issuer: 'UIDAI', status: 'Verified' },
    { id: 'dl_01', type: 'Driving License', issuer: 'Ministry of Road Transport', status: 'Verified' },
    { id: 'ssc_01', type: 'Class X Marksheet', issuer: 'State Board of Secondary Education', status: 'Verified' }
  ];

  const handleDigiLockerLogin = () => {
    setAuthState('connecting');
    setTimeout(() => {
      setAuthState('authenticated');
    }, 1200);
  };

  const handleFetchDocuments = () => {
    setAuthState('fetching');
    setTimeout(() => {
      setFetchedDocs(mockIssuedDocuments);
      setAuthState('complete');
      if (onDocumentFetched) onDocumentFetched(mockIssuedDocuments);
    }, 1500);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900">DigiLocker DPI Portal Sandbox</h3>
          <p className="text-xs text-slate-500">Fetch official digitally signed government records</p>
        </div>
      </div>

      {authState === 'idle' && (
        <div className="text-center py-4">
          <p className="text-xs text-slate-600 mb-4">Authenticate securely via Digital India DPI infrastructure.</p>
          <button 
            onClick={handleDigiLockerLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition"
          >
            <span>Connect with DigiLocker</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {authState === 'connecting' && (
        <div className="flex flex-col items-center justify-center py-6 space-y-2">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-600">Establishing OAuth 2.0 Secure Handshake...</p>
        </div>
      )}

      {authState === 'authenticated' && (
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <CheckCircle2 className="w-4 h-4" />
            <span>Identity Authenticated via MeriDPE</span>
          </div>
          <button 
            onClick={handleFetchDocuments}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition"
          >
            Pull Issuer-Verified Documents
          </button>
        </div>
      )}

      {authState === 'fetching' && (
        <div className="flex flex-col items-center justify-center py-6 space-y-2">
          <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          <p className="text-xs text-slate-600">Querying Official Issuers (UIDAI & MoRTH)...</p>
        </div>
      )}

      {authState === 'complete' && (
        <div className="space-y-3 mt-2">
          <p className="text-xs font-semibold text-slate-700">Verified Documents Retrieved:</p>
          {fetchedDocs.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">{doc.type}</p>
                  <p className="text-[10px] text-slate-500">{doc.issuer}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}