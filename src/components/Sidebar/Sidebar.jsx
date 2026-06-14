import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Teacher Management", path: "/teachers" },
  { label: "Attendance", path: "/attendance" },
  { label: "Attendance Reports", path: "/attendance-reports" },
  { label: "Calendar", path: "/calendar" },
  { label: "Notices", path: "/notices" },
  { label: "Tasks", path: "/tasks" },
  { label: "Activity Logs", path: "/activity-logs" },
  { label: "Settings", path: "/settings" },
  { label: "Logout", path: "/", external: false },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__logo">NEXUS</span>
        <p>Staff Management</p>
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
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__profile card">
        <div className="sidebar__profile-avatar">O</div>
        <div className="sidebar__profile-info">
          <strong>Olivia Price</strong>
          <span>Operations Lead</span>
        </div>
      </div>
    </aside>
  );
}
