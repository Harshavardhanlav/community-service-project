import { useEffect, useState } from "react";

import { TeacherCard } from "../../components/TeacherCard/TeacherCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import "./TeacherManagement.css";
import {
   createTeacher,
   getTeachers,
   deleteTeacher,
   updateTeacher
} from "../../services/api";
const initialForm = {
  teacherID: "",
  password: "",
  fullName: "",
  subjects: "",
  mobile: "",
  designation: "",
  profilePic: "",
};

export default function TeacherManagement() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    setLoading(true);
    setError("");
    try {
      const data = await getTeachers();
      setTeachers(data || []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleProfileUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  function openCreatePanel() {
    setSelectedTeacher(null);
    setForm(initialForm);
    setIsEdit(false);
    setPanelOpen(true);
    setMessage("");
  }

  function handleEdit(teacher) {
    setSelectedTeacher(teacher);
    setForm({
      teacherID: teacher.teacherID || "",
      password: "",
      fullName: teacher.fullName || "",
      subjects: teacher.subjects || "",
      mobile: teacher.mobile || "",
      designation: teacher.designation || "",
      profilePic: teacher.profilePic || "",
    });
    setIsEdit(true);
    setPanelOpen(true);
    setMessage("");
  }

  function handleDelete(teacher) {
    setSelectedTeacher(teacher);
    setConfirmDelete(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      if (isEdit) {
        await updateTeacher(selectedTeacher._id, form);
      } else {
        await createTeacher(form);
      }
      await fetchTeachers();
      setPanelOpen(false);
      setForm(initialForm);
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

async function confirmDeleteAction() {

   try {

      await deleteTeacher(selectedTeacher._id);

      await fetchTeachers();

      setConfirmDelete(false);

      setSelectedTeacher(null);

   } catch (error) {

      setMessage(error.message);

   }

}

  return (
    <section className="teacher-management-page">
      <div className="teacher-management-header card">
        <div>
          <h2>👨‍🏫Teacher Management</h2>
          <p>Keep teacher records up to date and add new staff profiles.</p>
        </div>
        <button type="button" className="primary" onClick={openCreatePanel}>
          Add Teacher
        </button>
      </div>

      {loading ? (
        <div className="teacher-management-loading">
          <LoadingSpinner />
          <span>Loading teachers...</span>
        </div>
      ) : error ? (
        <div className="teacher-management-error card">
          <h2>Could not load teachers</h2>
          <p>{error}</p>
        </div>
      ) : teachers.length === 0 ? (
        <EmptyState
          title="No teachers found"
          message="Add your first teacher to begin managing staff in NEXUS."
        />
      ) : (
<div className="teacher-management-grid">

  {teachers.map((teacher) => (

    <div
      className="teacher-card"
      key={teacher._id || teacher.teacherID}
    >

      <div className="teacher-card-image">

        <img
          src={teacher.profilePic}
          alt={teacher.fullName}
        />

      </div>

      <div className="teacher-card-details">

        <h3>{teacher.fullName}</h3>

        <p>
          <strong>ID:</strong> {teacher.teacherID}
        </p>

        <p>
          <strong>Subject:</strong> {teacher.subjects}
        </p>

        <p>
          <strong>Mobile:</strong> {teacher.mobile}
        </p>

        <p>
          <strong>Designation:</strong> {teacher.designation}
        </p>

      </div>

      <div className="teacher-card-actions">

        <button
          className="primary"
          onClick={() => handleEdit(teacher)}
        >
          Edit
        </button>

        <button
          className="secondary"
          onClick={() => handleDelete(teacher)}
        >
          Delete
        </button>

      </div>

    </div>

  ))}

</div>
      )}

      {panelOpen && (
        <div className="panel-drawer">
          <div className="panel-drawer__content card">
            <div className="panel-drawer__header">
              <h3>{isEdit ? "Edit Teacher" : "Add Teacher"}</h3>
              <button type="button" className="secondary" onClick={() => setPanelOpen(false)}>
                Close
              </button>
            </div>
            <form className="teacher-form" onSubmit={handleSubmit}>
              
              <div className="form-row">
<label>

  Teacher ID

  <div className="input-with-icon">

    <span className="input-icon">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeWidth="1.25"
          d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>

    </span>

    <input
      name="teacherID"
      value={form.teacherID}
      onChange={handleInputChange}
      required
    />

  </div>

</label>
              <label>

  Password

  <div className="input-with-icon">

    <span className="input-icon icon2">

      <svg
        stroke="currentColor" 
        strokeWidth="1.5"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
      >
        <path
          d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>

    </span>

    <input
      name="password"
      type="password"
      value={form.password}
      onChange={handleInputChange}
      required={!isEdit}
    />

  </div>

</label>
              </div>
              <div className="form-row">
<label>

  Full Name

  <div className="input-with-icon">

    <span className="input-icon">

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeWidth="1.25"
          d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
        />
      </svg>

    </span>

    <input
      name="fullName"
      value={form.fullName}
      onChange={handleInputChange}
      required
    />

  </div>

</label>
                <label>
                  Subjects
                  <input name="subjects" value={form.subjects} onChange={handleInputChange} required />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Mobile
                  <input name="mobile" type="tel" value={form.mobile} onChange={handleInputChange} required />
                </label>
                <label>
                  Designation
                  <input name="designation" value={form.designation} onChange={handleInputChange} required />
                </label>
              </div>
              <div className="form-row full">
                <label>
                  Profile Picture Upload
                  <input type="file" accept="image/*" onChange={handleProfileUpload} />
                </label>
              </div>
              {message && <p className="form-message">{message}</p>}
              <div className="panel-drawer__cta">
                <button type="submit" className="primary">
                  {isEdit ? "Save Changes" : "Create Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{confirmDelete && selectedTeacher && (
  <ConfirmModal
    title="Delete Teacher?"
    message={`Are you sure you want to delete ${selectedTeacher.fullName}?`}
    confirmLabel="Delete"
    onCancel={() => {
      setConfirmDelete(false);
      setSelectedTeacher(null);
    }}
    onConfirm={confirmDeleteAction}
  />
)}
    </section>
  );
}
