import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { ThemeContext } from "../ThemeProvider/ThemeProvider";
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
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="page-header">
      <div>
        <p className="page-badge">NEXUS Admin</p>
        <h1>{title}</h1>
      </div>
      <button type="button" className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </header>
  );
}
