import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

/* ── Google OAuth ── */
export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

/* ── Email / Password ── */
export async function loginWithEmail(email, password) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function signupWithEmail(email, password, displayName) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  await sendEmailVerification(result.user);
  return result.user;
}

export async function resetPassword(email) {
  await sendPasswordResetEmail(auth, email);
}

/* ── Sign out ── */
export async function logout() {
  await signOut(auth);
}

/* ── Get current token (for API calls) ── */
export async function getIdToken() {
  const user = auth.currentUser;
  if (!user) return null;
  return user.getIdToken();
}

/* ── Friendly error messages ── */
export function parseAuthError(error) {
  const map = {
    "auth/user-not-found":         "No account found with this email.",
    "auth/wrong-password":         "Incorrect password.",
    "auth/email-already-in-use":   "This email is already registered.",
    "auth/weak-password":          "Password must be at least 6 characters.",
    "auth/invalid-email":          "Please enter a valid email address.",
    "auth/popup-closed-by-user":   "Google sign-in was cancelled.",
    "auth/network-request-failed": "Network error. Check your connection.",
    "auth/too-many-requests":      "Too many attempts. Try again later.",
    "auth/invalid-credential":     "Invalid email or password.",
  };
  return map[error.code] || error.message || "An unexpected error occurred.";
}
