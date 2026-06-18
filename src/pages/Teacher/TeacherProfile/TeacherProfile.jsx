import { useState } from "react";
import "./TeacherProfile.css";

export default function TeacherProfile() {
  const teacher = JSON.parse(localStorage.getItem("teacherData")) || {};
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    fullName: teacher.fullName || "",
    subjects: teacher.subjects || "",
    mobile: teacher.mobile || "",
    designation: teacher.designation || "",
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setMessage("");
    try {
      const response = await fetch(
        `https://community-service-project-backend.onrender.com/teachers/update/${teacher._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update localStorage
        const updatedTeacher = { ...teacher, ...formData };
        localStorage.setItem("teacherData", JSON.stringify(updatedTeacher));
        setMessage("✅ Profile updated successfully");
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update profile: " + data.message);
      }
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    }
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
        `https://community-service-project-backend.onrender.com/teachers/update/${teacher._id}`,
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
          oldPassword: "",
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

  return (
    <section className="teacher-profile-page">
      <div className="teacher-profile__container">
        {/* Header */}
        <div className="teacher-profile__header card">
          <div className="teacher-profile__header-content">
            <h1>👤 My Profile</h1>
            <p>View and edit your profile information</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="teacher-profile__card card">
          <div className="profile-header">
            <div className="profile-avatar">
              {teacher.profilePic ? (
                <img src={teacher.profilePic} alt={teacher.fullName} />
              ) : (
                <span>{teacher.fullName?.charAt(0) || "T"}</span>
              )}
            </div>
            <div className="profile-name-info">
              <h2>{teacher.fullName}</h2>
              <p className="profile-id">ID: {teacher.teacherID}</p>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`profile-message ${message.includes("✅") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          {/* Profile Information */}
          {!isEditing ? (
            <div className="profile-info">
              <div className="profile-field">
                <span className="field-label">Full Name</span>
                <span className="field-value">{formData.fullName}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Teacher ID</span>
                <span className="field-value">{teacher.teacherID}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Subject</span>
                <span className="field-value">{formData.subjects}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Mobile Number</span>
                <span className="field-value">{formData.mobile}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Designation</span>
                <span className="field-value">{formData.designation}</span>
              </div>
            </div>
          ) : (
            <div className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subjects"
                  value={formData.subjects}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="profile-actions">
            {!isEditing ? (
              <>
                <button
                  className="profile-btn profile-btn--primary"
                  onClick={() => setIsEditing(true)}
                >
                  ✏️ Edit Profile
                </button>
                <button
                  className="profile-btn profile-btn--secondary"
                  onClick={() => setShowPasswordForm(true)}
                >
                  🔐 Change Password
                </button>
              </>
            ) : (
              <>
                <button
                  className="profile-btn profile-btn--primary"
                  onClick={handleSaveProfile}
                >
                  💾 Save Changes
                </button>
                <button
                  className="profile-btn profile-btn--cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Password Form Modal */}
        {showPasswordForm && (
          <div className="password-modal-overlay" onClick={() => setShowPasswordForm(false)}>
            <div className="password-modal card" onClick={(e) => e.stopPropagation()}>
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
                  className="profile-btn profile-btn--primary"
                  onClick={handleChangePassword}
                >
                  Update Password
                </button>
                <button
                  className="profile-btn profile-btn--cancel"
                  onClick={() => setShowPasswordForm(false)}
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
