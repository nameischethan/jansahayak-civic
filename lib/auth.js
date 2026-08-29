// ─────────────────────────────────────────────────────────────
// lib/auth.js
// Mock OTP-based phone authentication.
//
// HONESTY NOTE: no real SMS gateway is used. The "OTP" is a fixed
// demo code (NEXT_PUBLIC_DEMO_OTP, default 123456) shown directly
// in the UI, so judges can log in without a real phone/SMS. Swap
// `sendOtp` for a real provider (MSG91, Twilio Verify, Firebase
// Phone Auth) to go to production — the verify/session contract
// below stays the same.
// ─────────────────────────────────────────────────────────────

import { lsGet, lsSet, lsRemove } from "./storage";

const DEMO_OTP = process.env.NEXT_PUBLIC_DEMO_OTP || "123456";

export function sendOtp(phone) {
  // In production: call SMS gateway here. We just stash an
  // expiring OTP challenge in localStorage.
  const challenge = { phone, otp: DEMO_OTP, sentAt: Date.now() };
  lsSet("otp_challenge", challenge);
  return { success: true, demoOtp: DEMO_OTP };
}

export function verifyOtp(phone, otp) {
  const challenge = lsGet("otp_challenge");
  if (!challenge || challenge.phone !== phone) {
    return { success: false, error: "No OTP was requested for this number." };
  }
  if (Date.now() - challenge.sentAt > 5 * 60 * 1000) {
    return { success: false, error: "OTP expired. Please request a new one." };
  }
  if (challenge.otp !== otp.trim()) {
    return { success: false, error: "Incorrect OTP. Please try again." };
  }
  lsRemove("otp_challenge");
  return { success: true };
}

export function getUserByPhone(phone) {
  const users = lsGet("users", []);
  return users.find((u) => u.phone === phone) || null;
}

export function upsertUser(profile) {
  const users = lsGet("users", []);
  const idx = users.findIndex((u) => u.phone === profile.phone);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...profile };
  } else {
    users.push({ ...profile, createdAt: new Date().toISOString() });
  }
  lsSet("users", users);
  return getUserByPhone(profile.phone);
}

export function createSession(phone) {
  const session = { phone, loggedInAt: new Date().toISOString() };
  lsSet("session", session);
  return session;
}

export function getSession() {
  return lsGet("session", null);
}

export function logout() {
  lsRemove("session");
}
