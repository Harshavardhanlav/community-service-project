import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TeacherSettings.css";

export default function TeacherSettings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const teacher = JSON.parse(localStorage.getItem("teacherData")) || {};

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    setMessage("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/teachers/update/${teacher._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...teacher,
            password: passwordForm.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Password changed successfully");
        setShowPasswordForm(false);
        setPasswordForm({
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to change password: " + data.message);
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("teacherID");
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherData");
    localStorage.removeItem("teacherCompletedTasks");
    window.location.href = "/";
  };

  return (
    <section className="teacher-settings-page">
      <div className="teacher-settings__container">
        {/* Header */}
        <div className="teacher-settings__header card">
          <div className="teacher-settings__header-content">
            <h1>⚙️ Settings</h1>
            <p>Manage your account preferences and settings</p>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`settings-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        {/* Settings Sections */}

        {/* Appearance Settings */}
        <div className="settings-section card">
          <h3 className="section-title">🎨 Appearance</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Theme</p>
              <p className="setting-desc">Choose between light and dark theme</p>
            </div>
            <div className="setting-control">
              <button
                className={`theme-toggle ${theme === "dark" ? "dark" : ""}`}
                onClick={handleThemeToggle}
              >
                {theme === "light" ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="settings-section card">
          <h3 className="section-title">🔐 Security</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Password</p>
              <p className="setting-desc">Change your account password</p>
            </div>
            <div className="setting-control">
              <button
                className="settings-btn settings-btn--secondary"
                onClick={() => setShowPasswordForm(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="settings-section card">
          <h3 className="section-title">👤 Account</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Name</p>
              <p className="setting-value">{teacher.fullName}</p>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Email/ID</p>
              <p className="setting-value">{teacher.teacherID}</p>
            </div>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Subject</p>
              <p className="setting-value">{teacher.subjects}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section card danger-zone">
          <h3 className="section-title">⚠️ Danger Zone</h3>
          <div className="setting-item">
            <div className="setting-info">
              <p className="setting-name">Logout</p>
              <p className="setting-desc">Sign out of your account</p>
            </div>
            <div className="setting-control">
              <button
                className="settings-btn settings-btn--danger"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Password Modal */}
        {showPasswordForm && (
          <div
            className="password-modal-overlay"
            onClick={() => setShowPasswordForm(false)}
          >
            <div
              className="password-modal card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setShowPasswordForm(false)}
              >
                ✕
              </button>
              <h3>🔐 Change Password</h3>
              <div className="password-form">
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                  />
                </div>
              </div>
              <div className="password-actions">
                <button
                  className="settings-btn settings-btn--primary"
                  onClick={handleChangePassword}
                >
                  Update Password
                </button>
                <button
                  className="settings-btn settings-btn--cancel"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div
            className="logout-modal-overlay"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <div
              className="logout-modal card"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>🚪 Confirm Logout</h3>
              <p>Are you sure you want to logout from your account?</p>
              <div className="modal-actions">
                <button
                  className="settings-btn settings-btn--danger"
                  onClick={handleLogout}
                >
                  Yes, Logout
                </button>
                <button
                  className="settings-btn settings-btn--cancel"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
