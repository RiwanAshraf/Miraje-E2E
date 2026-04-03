import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarCanvas from "../components/ui/StarCanvas";
import { loginWithEmail, signupWithEmail, loginWithGoogle, parseAuthError } from "../services/auth";
import "../styles/auth.css";

export default function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab]           = useState("login"); // "login" | "signup"
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [success, setSuccess]   = useState(null);
  const [showPass, setShowPass] = useState(false);

  function clearState() { setError(null); setSuccess(null); }

  async function handleSubmit(e) {
    e.preventDefault();
    clearState(); setLoading(true);
    try {
      if (tab === "login") {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password, name);
        setSuccess("Account created! Check your email to verify, then sign in.");
        setTab("login");
        setLoading(false);
        return;
      }
      navigate("/analysis");
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    clearState(); setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/analysis");
    } catch (err) {
      setError(parseAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-root">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="auth-sky"><StarCanvas /></div>
        <div className="auth-ground" />
        <div className="auth-horizon-glow" />
        <div className="auth-heat">
          {[{ d: "3.5s", dl: "0s", op: 0.10 }, { d: "4.2s", dl: ".4s", op: 0.07 }, { d: "5.1s", dl: "1.2s", op: 0.04 }].map((h, i) => (
            <div key={i} className="auth-heat-wave" style={{ "--d": h.d, "--delay": h.dl, "--op": h.op }} />
          ))}
        </div>
      </div>

      {/* Glass card */}
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-wordmark">MIRAJE</div>
          <div className="auth-tagline">Synthetic Media Intelligence</div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab${tab === "login" ? " active" : ""}`}
            onClick={() => { setTab("login"); clearState(); }}
          >
            Sign In
          </button>
          <button
            className={`auth-tab${tab === "signup" ? " active" : ""}`}
            onClick={() => { setTab("signup"); clearState(); }}
          >
            Create Account
          </button>
          <div className="auth-tab-indicator" style={{ transform: tab === "login" ? "translateX(0)" : "translateX(100%)" }} />
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {tab === "signup" && (
            <div className="auth-field">
              <label className="auth-label" htmlFor="auth-name">Full Name</label>
              <div className="auth-input-wrap">
                <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  id="auth-name"
                  type="text"
                  className="auth-input"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={tab === "signup"}
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">Email Address</label>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m2 7 10 7 10-7"/>
              </svg>
              <input
                id="auth-email"
                type="email"
                className="auth-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label className="auth-label" htmlFor="auth-password">Password</label>
              {tab === "login" && (
                <button type="button" className="auth-forgot" onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              )}
            </div>
            <div className="auth-input-wrap">
              <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="auth-password"
                type={showPass ? "text" : "password"}
                className="auth-input"
                placeholder={tab === "signup" ? "Min. 6 characters" : "Your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={tab === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPass((p) => !p)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Error / Success */}
          {error   && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {/* Submit button */}
          <button type="submit" className="auth-submit" disabled={loading}>
            <span>{loading ? "Processing…" : tab === "login" ? "Sign In" : "Create Account"}</span>
            {loading && <div className="auth-spinner" />}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider">
          <div className="auth-div-line" />
          <span className="auth-div-text">or continue with</span>
          <div className="auth-div-line" />
        </div>

        {/* Google button */}
        <button className="auth-google" onClick={handleGoogle} disabled={loading}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer note */}
        {tab === "signup" && (
          <p className="auth-terms">
            By creating an account you agree to our{" "}
            <a href="#" className="auth-link">Terms of Service</a> and{" "}
            <a href="#" className="auth-link">Privacy Policy</a>.
          </p>
        )}
      </div>
    </div>
  );
}
