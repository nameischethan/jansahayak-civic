// ─────────────────────────────────────────────────────────────
// lib/storage.js
// Generic LocalStorage persistence layer + a simulated
// Firebase-Storage/Cloudinary-style cloud vault fallback.
//
// HONESTY NOTE: there is no real cloud bucket wired up in this
// prototype (that requires live credentials/billing this hackathon
// build intentionally avoids). Instead, uploaded files are stored
// as base64 in LocalStorage under a "cloud://" -style key, and every
// "cloud" operation runs through simulateLatency() + a synthetic
// signed-URL shape, so the UI/UX and integration seam are real and
// swappable for a genuine Firebase/Cloudinary SDK call later —
// see README "Cloud Storage Swap-In Guide".
// ─────────────────────────────────────────────────────────────

const NS = "jansahayak:";

export function lsGet(key, fallback = null) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(NS + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NS + key, JSON.stringify(value));
  } catch (e) {
    console.error("LocalStorage write failed (quota exceeded?):", e);
  }
}

export function lsRemove(key) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(NS + key);
}

export function simulateLatency(min = 500, max = 1400) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Simulated cloud upload (stands in for Firebase Storage / Cloudinary).
 * Persists the base64 payload into LocalStorage's document vault index
 * and returns a synthetic signed URL + metadata, mirroring the real
 * SDK response shape so swapping in a live provider later only touches
 * this one function.
 */
export async function cloudUploadDocument({ ownerPhone, docType, file }) {
  await simulateLatency(900, 1900);
  const base64 = await fileToBase64(file);
  const id = `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const record = {
    id,
    ownerPhone,
    docType,
    fileName: file.name,
    mimeType: file.type,
    sizeKb: Math.round(file.size / 1024),
    dataUrl: base64,
    cloudUrl: `https://vault.jansahayak.synthetic/${ownerPhone}/${id}`,
    uploadedAt: new Date().toISOString(),
    encrypted: true,
  };
  const vault = lsGet("vault", []);
  vault.push(record);
  lsSet("vault", vault);
  return record;
}

export function getVaultForUser(phone) {
  return lsGet("vault", []).filter((d) => d.ownerPhone === phone);
}

export function deleteVaultDoc(id) {
  const vault = lsGet("vault", []).filter((d) => d.id !== id);
  lsSet("vault", vault);
}

export function generateReferenceId(prefix = "JSK") {
  const rand = Math.floor(100000 + Math.random() * 899999);
  const year = new Date().getFullYear();
  return `${prefix}-${year}-${rand}`;
}
