import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", path: "/", icon: "🏠" },
  { label: "Teacher Management", path: "/teachers", icon: "👨‍🏫" },
  { label: "Mark Attendance", path: "/attendance", icon: "🖐️" },
  { label: "My Report", path: "/attendance-reports", icon: "📊" },
  { label: "Calendar", path: "/calendar", icon: "📅" },
  { label: "Notices", path: "/notices", icon: "📢" },
  { label: "Tasks", path: "/tasks", icon: "✅" },
  { label: "Activity Logs", path: "/activity-logs", icon: "📝" },
  { label: "Settings", path: "/settings", icon: "⚙️" },
];

export function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">
    <i style={{ fontStyle: "normal", marginRight: "8px", verticalAlign: "middle" }}>🎓</i>
    NEXUS
  </span>
  <h4>Teacher Management</h4>
      </div>

      <nav className="sidebar__nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            {/* 🌟 Hardcoded style wrapper to force emojis to display inline with proper layout dimensions */}
            <i style={{ fontStyle: "normal", marginRight: "12px", display: "inline-block" }}>
              {item.icon}
            </i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}