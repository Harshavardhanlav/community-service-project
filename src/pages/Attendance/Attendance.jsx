import { useEffect, useMemo, useState } from "react";
import { getAttendanceRecords } from "../../services/api";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import "./Attendance.css";

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    setLoading(true);
    setError("");
    try {
      const data = await getAttendanceRecords();
      setRecords(data || []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
  loadAttendance();
}, []);

  const filteredRecords = useMemo(() => {
    return (records || []).filter((record) => {
      const search = query.toLowerCase();
      const matchesSearch =
        !search ||
        record.teacherId?.toLowerCase().includes(search) ||
        record.status?.toLowerCase().includes(search);
      const matchesStatus = !statusFilter || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, query, statusFilter]);

  return (
    <section className="attendance-page">
      <div className="attendance-page__header card">
        <div>
          <h2>📲Attendance Records</h2>
          <p>Review attendance status for teachers across the school.</p>
        </div>
      </div>

      <div className="attendance-page__toolbar card">
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Teacher ID or status" />
        </label>
        <label>
          Filter by Status
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </label>
      </div>

      {loading ? (
        <div className="attendance-page__empty card">
          <LoadingSpinner />
          <span>Loading attendance records...</span>
        </div>
      ) : error ? (
        <div className="attendance-page__error card">
          <h3>Unable to load attendance</h3>
          <p>{error}</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <EmptyState title="No attendance records" message="Use the attendance interface to begin capturing staff attendance." />
      ) : (
        <div className="attendance-table card">
          <table>
            <thead>
              <tr>
                <th><b>🆔Teacher ID</b></th>
                <th><b>📅Date</b></th>
                <th><b>✅Status</b></th>
                <th><b>📍Location</b></th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record._id || `${record.teacherId}-${record.attendanceDate}`}>
                  <td>{record.teacherId}</td>
                  <td>{new Date(record.attendanceDate).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                  <td>{record.latitude && record.longitude ? `${record.latitude.toFixed(2)}, ${record.longitude.toFixed(2)}` : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
