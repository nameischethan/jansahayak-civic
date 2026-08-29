import { useState, useEffect, useRef } from "react";
import Layout from "../../components/Layout";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useApp } from "../../context/AppContext";
import { cloudUploadDocument, getVaultForUser, deleteVaultDoc } from "../../lib/storage";
import { Vault, UploadCloud, Loader2, Trash2, Download, FileText, Lock } from "lucide-react";

const DOC_TYPES = ["Aadhaar Card", "PAN Card", "Marksheet", "Income Certificate", "Caste Certificate", "Driving Licence", "Passport", "Other"];

export default function DocumentVault() {
  const { user } = useApp();
  const [docType, setDocType] = useState(DOC_TYPES[0]);
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user?.phone) setItems(getVaultForUser(user.phone));
  }, [user]);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file || !user?.phone) return;
    setUploading(true);
    try {
      await cloudUploadDocument({ ownerPhone: user.phone, docType, file });
      setItems(getVaultForUser(user.phone));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleDelete(id) {
    deleteVaultDoc(id);
    setItems(getVaultForUser(user.phone));
  }

  return (
    <ProtectedRoute>
      <Layout title="Secure Document Vault">
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5">
          <h2 className="text-lg font-bold text-navy-800 mb-1 flex items-center gap-2"><Vault size={20} /> Upload to Vault</h2>
          <p className="text-sm text-slate-500 mb-4 flex items-center gap-1.5"><Lock size={13} /> Stored locally + simulated encrypted cloud sync</p>

          <select value={docType} onChange={(e) => setDocType(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2.5 bg-white focus:border-saffron-500 outline-none mb-3">
            {DOC_TYPES.map((d) => <option key={d}>{d}</option>)}
          </select>

          <label className="w-full flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-saffron-500 rounded-xl py-8 text-slate-500 hover:text-saffron-600 cursor-pointer">
            {uploading ? <Loader2 size={26} className="animate-spin" /> : <UploadCloud size={26} />}
            <span className="font-semibold text-sm">{uploading ? "Encrypting & syncing to vault…" : "Tap to choose a file"}</span>
            <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} disabled={uploading} />
          </label>
        </div>

        <div>
          <p className="text-sm font-semibold text-navy-800 mb-2">{items.length} document(s) stored</p>
          <div className="grid grid-cols-2 gap-3">
            {items.map((d) => (
              <div key={d.id} className="bg-white rounded-2xl shadow-card border border-slate-100 p-3">
                {d.mimeType?.startsWith("image/") ? (
                  <img src={d.dataUrl} alt={d.fileName} className="w-full h-24 object-cover rounded-lg mb-2 decorative-gradient" />
                ) : (
                  <div className="w-full h-24 bg-slate-100 rounded-lg mb-2 flex items-center justify-center">
                    <FileText size={28} className="text-slate-400" />
                  </div>
                )}
                <p className="text-xs font-bold text-navy-800 truncate">{d.docType}</p>
                <p className="text-[11px] text-slate-500 truncate mb-2">{d.fileName} · {d.sizeKb}KB</p>
                <div className="flex gap-1.5">
                  <a href={d.dataUrl} download={d.fileName} className="flex-1 flex items-center justify-center gap-1 text-xs bg-slate-50 hover:bg-slate-100 rounded-lg py-2 text-navy-800 font-semibold">
                    <Download size={13} /> Save
                  </a>
                  <button onClick={() => handleDelete(d.id)} className="flex-1 flex items-center justify-center gap-1 text-xs bg-risk-bg hover:opacity-80 rounded-lg py-2 text-risk-text font-semibold">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="col-span-2 bg-white rounded-2xl shadow-card border border-slate-100 p-6 text-center text-sm text-slate-500">
                No documents uploaded yet.
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
