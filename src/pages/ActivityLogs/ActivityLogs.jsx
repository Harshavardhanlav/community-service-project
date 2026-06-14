import { useEffect, useState } from "react";
import { getActivityLogs } from "../../services/api";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import "./ActivityLogs.css";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      setError("");
      try {
        const data = await getActivityLogs();
        setLogs(data || []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <section className="activity-logs-page">
      <div className="activity-logs-header card">
        <div>
          <h2>Activity Logs</h2>
          <p>See the latest activity timeline for teachers, notices, and attendance changes.</p>
        </div>
      </div>

      {loading ? (
        <div className="activity-logs-loading card">
          <LoadingSpinner />
          <span>Loading activity logs...</span>
        </div>
      ) : error ? (
        <div className="activity-logs-error card">
          <h3>Unable to load activity logs</h3>
          <p>{error}</p>
        </div>
      ) : logs.length === 0 ? (
        <EmptyState title="No activity logged" message="No activity has been recorded yet." />
      ) : (
        <div className="activity-timeline card">
          <ul>
            {logs.map((entry) => (
              <li key={entry.id} className="activity-timeline-item">
                <div className="activity-timeline-item__marker" />
                <div>
                  <p className="activity-timeline-item__type">{entry.type}</p>
                  <p>{entry.title}</p>
                  <p>{entry.description}</p>
                  <time>{new Date(entry.date).toLocaleString()}</time>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
