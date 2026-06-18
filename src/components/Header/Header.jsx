import { useLocation } from "react-router-dom";
import "./Header.css";

const pageTitles = {
  "/": "Dashboard",
  "/teachers": "Teacher Management",
  "/attendance": "Attendance",
  "/attendance-reports": "Attendance Reports",
  "/calendar": "Calendar",
  "/notices": "Notices",
  "/tasks": "Tasks",
  "/activity-logs": "Activity Logs",
  "/settings": "Settings",
};

export function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="page-header">
      <div>
        <p className="page-badge">🟢 Nexus Admin/Teacher Portal</p>
      </div>
      {/* Theme toggle button has been removed */}
    </header>
  );
}