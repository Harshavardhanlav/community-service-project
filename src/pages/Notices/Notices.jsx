import { useEffect, useState } from "react";
import { createNotice, getNotices } from "../../services/api";
import { NoticeCard } from "../../components/NoticeCard/NoticeCard";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import "./Notices.css";

const initialForm = {
  title: "",
  message: "",
  priority: "Medium",
};

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    setError("");
    try {
      const data = await getNotices();
      setNotices(data || []);
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

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await createNotice(form);
      setForm(initialForm);
      await fetchNotices();
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  function handleEdit(notice) {
    setConfirmAction({ title: "Edit Notice", message: "Editing notices is not exposed through the backend API yet." });
  }

  function handleDelete(notice) {
    setConfirmAction({ title: "Delete Notice", message: "Deleting notices is not exposed through the backend API yet." });
  }
  const filteredNotices = notices.filter((notice) =>
  notice.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  notice.message?.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <section className="notices-page">
<div className="notices-page__header">

  <div>
    <h2>Notices</h2>
    <p>View and manage all published notices.</p>
  </div>

  <button
    className="primary"
    onClick={() => setShowForm(true)}
  >
    + Create Notice
  </button>

</div>

      <div className="notices-page__layout">


        <div className="notices-list card">

          <h3>Published Notices</h3>
<div className="search-box">

  <span className="search-icon">

    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-4.35-4.35M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z"
      />
    </svg>

  </span>

  <input
    type="text"
    placeholder="Search notices..."
    className="notice-search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

</div>
          {loading ? (
            <div className="notices-list__loading">
              <LoadingSpinner />
              <span>Loading notices...</span>
            </div>
          ) : error ? (
            <div className="notices-list__error">
              <h4>Unable to load notices</h4>
              <p>{error}</p>
            </div>
          ) : notices.length === 0 ? (
            <EmptyState
              title="No notices yet"
              message="Publish your first notice to keep staff informed."
            />
          ) : (
           <div className="notices-scroll">
  <div className="notices-grid">
             {filteredNotices.map((notice) => (
                <NoticeCard
                  key={notice._id || notice.title}
                  notice={notice}
                  onEdit={() => handleEdit(notice)}
                  onDelete={() => handleDelete(notice)}
                />
              ))}
              </div>
            </div>
          )}
        </div>
      </div>
{showForm && (

  <div className="notice-modal">

    <div className="notice-modal-content card">

      <div className="notice-modal-header">

        <h3>Create Notice</h3>

        <button
          type="button"
          className="secondary"
          onClick={() => setShowForm(false)}
        >
          Close
        </button>

      </div>

      <form onSubmit={handleSubmit}>

        <label>
          Title
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Message
          <textarea
            name="message"
            rows="5"
            value={form.message}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Priority
          <select
            name="priority"
            value={form.priority}
            onChange={handleInputChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </label>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="primary"
        >
          Publish Notice
        </button>

      </form>

    </div>

  </div>

)}

      {confirmAction && (
        <ConfirmModal
          title={confirmAction.title}
          message={confirmAction.message}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => setConfirmAction(null)}
          confirmLabel="OK"
        />
      )}
    </section>
  );
}
