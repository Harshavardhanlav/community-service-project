import { useEffect, useState } from "react";
import { getActivityLogs } from "../../services/api";
import  EmptyState  from "../../components/EmptyState/EmptyState";
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
        <div className="page-header-block">
          <h2>📋Activity Logs</h2>
          <p>See the latest system updates, management logs, and administrative adjustments.</p>
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
        <div className="activity-table-container">
          <table className="activity-table">
            <thead>
              <tr>
                <th>Action Type</th>
                <th>Target Event</th>
                <th>Description Details</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((entry) => {
                let badgeClass = "activity-badge--info";
                let emoji = "📝";

                const typeLower = (entry.type || "").toLowerCase();
                const descLower = (entry.description || "").toLowerCase();

                // Determine emoji and color based on action type
                if (typeLower.includes("deleted")) {
                  badgeClass = "activity-badge--danger";
                  emoji = "🗑️";
                } else if (typeLower.includes("updated")) {
                  badgeClass = "activity-badge--warning";
                  emoji = "✏️";
                } else if (typeLower.includes("created") || typeLower.includes("added")) {
                  badgeClass = "activity-badge--success";
                  emoji = "✅";
                }

                // Determine entity-specific emoji
                if (typeLower.includes("notice")) {
                  badgeClass = typeLower.includes("deleted") 
                    ? "activity-badge--danger" 
                    : typeLower.includes("updated")
                    ? "activity-badge--warning"
                    : "activity-badge--warning";
                  emoji = "📢";
                } else if (typeLower.includes("teacher")) {
                  emoji = "👨‍🏫";
                } else if (typeLower.includes("task")) {
                  emoji = "✅";
                } else if (typeLower.includes("attendance")) {
                  badgeClass = "activity-badge--success";
                  emoji = "📋";
                }

                return (
                  <tr key={entry.id || entry.date}>
                    <td>
                      <span className={`activity-badge ${badgeClass}`}>
                        <i style={{ fontStyle: "normal" }}>{emoji}</i>
                        {entry.type || "Event"}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: "600", color: "#1a2e26" }}>
                        {entry.title || "Activity Update"}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#5c6f67" }}>{entry.description || "-"}</span>
                    </td>
                    <td className="activity-time-cell">
                      {entry.date ? new Date(entry.date).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : "Just now"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}