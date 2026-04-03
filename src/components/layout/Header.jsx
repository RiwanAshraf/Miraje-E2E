import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { logout } from "../../services/auth";

const NAV_ITEMS = [
  { label: "Analysis", path: "/analysis" },
  { label: "Archive",  path: "/archive"  },
  { label: "Reports",  path: "/reports"  },
  { label: "System",   path: "/system"   },
];

export default function Header() {
  const location = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/auth");
  }

  return (
    <header>
      <Link to="/" className="brand" style={{ textDecoration: "none" }}>
        <div className="brand-wordmark">MIRAJE</div>
        <div className="brand-divider" />
        <div className="brand-tagline">Where Reality Dissolves</div>
      </Link>

      <nav>
        {NAV_ITEMS.map((n) => (
          <Link
            key={n.label}
            to={n.path}
            className={`nav-btn${location.pathname === n.path ? " active" : ""}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div className="sys-status">
          <div className="pulse-dot" />
          <span>Systems Online</span>
        </div>

        {user && (
          <div className="user-pill">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "User"} className="user-avatar" />
            ) : (
              <div className="user-avatar-fallback">
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
            )}
            <span className="user-name">{user.displayName || user.email?.split("@")[0]}</span>
            <button className="logout-btn" onClick={handleLogout} title="Sign out">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
