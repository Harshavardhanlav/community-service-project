import { useEffect, useState } from "react";
import { createTask, getTasks } from "../../services/api";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import "./Tasks.css";

const initialForm = {
  title: "",
  description: "",
  assignedTo: "",
  deadline: "",
  status: "Pending",
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data || []);
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
await createTask(form);

setForm(initialForm);

setShowForm(false);

await fetchTasks();
    } catch (submitError) {
      setMessage(submitError.message);
    }
  }

  function handleEdit(task) {
    setConfirmAction({ title: "Edit Task", message: "Task editing is not exposed through the backend API yet." });
  }

  function handleDelete(task) {
    setConfirmAction({ title: "Delete Task", message: "Task deletion is not exposed through the backend API yet." });
  }
const filteredTasks = tasks.filter((task) => {

  const matchesSearch =
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    task.status === statusFilter;

  return matchesSearch && matchesStatus;
});
  return (
    <section className="tasks-page">
<div className="tasks-page__header card">

  <div>
    <h2>📝Tasks</h2>
    <p>Manage and track all teacher tasks.</p>
  </div>

  <button
    className="primary"
    onClick={() => setShowForm(true)}
  >
    + Create Task
  </button>

</div>

      <div className="tasks-page__layout">

        <div className="tasks-list card">
          <h3>📋Task List</h3>
          <div className="tasks-toolbar">

  <div className="tasks-search-box">

    <span className="tasks-search-icon">🔍</span>

    <input
      type="text"
      placeholder="Search tasks..."
      className="tasks-search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />

  </div>

  <select
    className="tasks-filter"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All Tasks</option>
    <option value="Pending">Pending</option>
    <option value="Completed">Completed</option>
  </select>

</div>
          {loading ? (
            <div className="tasks-list__loading">
              <LoadingSpinner />
              <span>Loading tasks...</span>
            </div>
          ) : error ? (
            <div className="tasks-list__error">
              <h4>Unable to load tasks</h4>
              <p>{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <EmptyState title="No tasks yet" message="Assign your first task to keep the team moving." />
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => (
<article
  key={task._id || task.title}
  className="task-card"
>

  <div className="task-header">

    <h4 className="task-title">
      {task.title}
    </h4>

    <span
      className={`task-status task-status-${task.status?.toLowerCase()}`}
    >
      {task.status}
    </span>

  </div>

  <div className="task-description">

    {task.description}

  </div>

  <div className="task-meta">

    <div className="task-meta-item">
      👨‍🏫 {task.assignedTo}
    </div>

    <div className="task-meta-item">
      ⏰ {task.deadline
        ? new Date(task.deadline).toLocaleDateString()
        : "No Deadline"}
    </div>

  </div>

  <div className="task-card__actions">

    <button
      type="button"
      className="secondary"
      onClick={() => handleEdit(task)}
    >
      Edit
    </button>

    <button
      type="button"
      className="secondary"
      onClick={() => handleDelete(task)}
    >
      Delete
    </button>

  </div>

</article>
              ))}
            </div>
          )}
        </div>
      </div>
{showForm && (

  <div className="task-modal">

    <div className="task-modal-content card">

      <div className="task-modal-header">

        <h3>Create Task</h3>

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
          Task Title
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Description
          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Assigned Teacher
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleInputChange}
            required
          />
        </label>

        <div className="form-row">

          <label>
            Deadline
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Status
            <select
              name="status"
              value={form.status}
              onChange={handleInputChange}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </label>

        </div>

        {message && (
          <p className="form-message">
            {message}
          </p>
        )}

        <button
          type="submit"
          className="primary"
        >
          Create Task
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
