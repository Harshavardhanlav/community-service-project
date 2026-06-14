import { useState } from "react";
import "./Settings.css";

export default function Settings() {

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function changePassword(event) {
    event.preventDefault();

    if (
      !passwords.currentPassword ||
      !passwords.newPassword ||
      passwords.newPassword !== passwords.confirmPassword
    ) {
      setMessage("Please confirm the new password.");
      return;
    }

    setMessage("Password changed successfully.");

    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  return (
    <section className="settings-page">

      <div className="settings-header card">
        <div>
          <h2>Settings</h2>
          <p>Manage your account password.</p>
        </div>
      </div>

      <div className="settings-card card">

        <h3>Change Password</h3>

        <form
          onSubmit={changePassword}
          className="settings-form"
        >

          <label>
            Current Password
            <input
              name="currentPassword"
              type="password"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
          </label>

          <label>
            New Password
            <input
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
          </label>

          <label>
            Confirm New Password
            <input
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
            />
          </label>

          <button
            type="submit"
            className="primary"
          >
            Change Password
          </button>

        </form>

      </div>

      {message && (
        <p className="settings-message">
          {message}
        </p>
      )}

    </section>
  );
}