import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth }      from "./hooks/useAuth";
import Cursor           from "./components/ui/Cursor";
import Header           from "./components/layout/Header";
import LandingPage      from "./pages/LandingPage";
import AnalysisPage     from "./pages/AnalysisPage";
import AuthPage         from "./pages/AuthPage";
import "./Miraje.css";
import "./styles/auth.css";

/* ── Protected route: redirects to /auth if not logged in ── */
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="auth-loading"><div className="auth-spinner" style={{ width: 24, height: 24, margin: "40vh auto" }} /></div>;
  if (!user)   return <Navigate to="/auth" replace />;
  return children;
}

/* ── Inner app (needs BrowserRouter context) ── */
function AppInner() {
  const { user }    = useAuth();
  const location    = useLocation();
  const isAuthPage  = location.pathname === "/auth";

  return (
    <>
      <Cursor />
      {!isAuthPage && user && <Header />}

      <Routes>
        {/* Public routes */}
        <Route path="/"       element={<Navigate to="/auth" replace />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth"   element={
          user ? <Navigate to="/analysis" replace /> : <AuthPage />
        } />

        {/* Protected routes */}
        <Route path="/analysis" element={<ProtectedRoute><AnalysisPage /></ProtectedRoute>} />
        <Route path="/archive"  element={<ProtectedRoute><PlaceholderPage title="Archive"  /></ProtectedRoute>} />
        <Route path="/reports"  element={<ProtectedRoute><PlaceholderPage title="Reports"  /></ProtectedRoute>} />
        <Route path="/system"   element={<ProtectedRoute><PlaceholderPage title="System"   /></ProtectedRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

/* ── Placeholder for unbuilt pages ── */
function PlaceholderPage({ title }) {
  return (
    <main>
      <div className="page" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
        <div className="sec-head" style={{ fontSize: 11 }}>{title}</div>
        <p style={{ color: "var(--fog)", fontSize: 13 }}>This section is coming soon.</p>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </BrowserRouter>
  );
}