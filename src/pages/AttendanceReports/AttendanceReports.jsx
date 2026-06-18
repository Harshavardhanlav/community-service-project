import { useEffect, useMemo, useState } from "react";
import { getTeachers, getTeacherAttendanceReport } from "../../services/api";
import { StatsCard } from "../../components/StatsCard/StatsCard";
import { AttendanceChart } from "../../components/AttendanceChart/AttendanceChart";
import  EmptyState  from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import "./AttendanceReports.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function AttendanceReports() {
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reportError, setReportError] = useState("");

  useEffect(() => {
    async function loadTeachers() {
      try {
        setLoading(true);
        const data = await getTeachers();
        if (data && Array.isArray(data) && data.length > 0) {
          setTeachers(data);
          setSelectedTeacher(data[0]?.teacherID || "");
        } else {
          setError("No teachers found in the system");
        }
      } catch (fetchError) {
        setError(fetchError.message || "Failed to load teachers");
      } finally {
        setLoading(false);
      }
    }
    loadTeachers();
  }, []);

  useEffect(() => {
    if (!selectedTeacher || !month || year === undefined) return;
    
    async function loadReport() {
      setReportError("");
      setReport(null);
      try {
        const data = await getTeacherAttendanceReport(selectedTeacher, month, year);
        if (data) {
          setReport(data);
        } else {
          setReportError("No attendance data available for selected period");
        }
      } catch (fetchError) {
        setReportError(fetchError.message || "Failed to load attendance report");
      }
    }
    loadReport();
  }, [selectedTeacher, month, year]);

  const chartData = useMemo(() => {
    if (!report) return [];
    const present = Number(report.presentDays || 0);
    const total = Number(report.totalWorkingDays || 0);
    return [
      { name: "Present", value: present },
      { name: "Absent", value: Math.max(total - present, 0) },
    ];
  }, [report]);

  return (
    <section className="attendance-reports-page">
      <div className="attendance-reports-header card">
        <div>
          <h2>📊Attendance Reports</h2>
          <p>View monthly attendance performance for each teacher in NEXUS.</p>
        </div>
      </div>

      <div className="attendance-reports__filters card">
        <label>
          Teacher
          <select value={selectedTeacher} onChange={(event) => setSelectedTeacher(event.target.value)}>
            {teachers.map((teacher) => (
              <option key={teacher._id || teacher.teacherID} value={teacher.teacherID}>
                {teacher.fullName} ({teacher.teacherID})
              </option>
            ))}
          </select>
        </label>
        <label>
          Month
          <select value={month} onChange={(event) => setMonth(Number(event.target.value))}>
            {months.map((name, index) => (
              <option key={name} value={index}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Year
          <input type="number" value={year} onChange={(event) => setYear(Number(event.target.value))} min="2020" />
        </label>
      </div>

      {loading ? (
        <div className="attendance-reports-loading card">
          <LoadingSpinner />
          <span>Loading teachers...</span>
        </div>
      ) : error ? (
        <div className="attendance-reports-error card">
          <h3>Unable to load teachers</h3>
          <p>{error}</p>
        </div>
      ) : reportError && !report ? (
        <div className="attendance-reports-error card">
          <h3>Unable to load report</h3>
          <p>{reportError}</p>
        </div>
      ) : !report ? (
        <EmptyState title="No report data" message="Select a teacher and month to view attendance details." />
      ) : (
        <>
          <div className="attendance-reports__stats">
            <StatsCard label="📊Attendance %" value={`${report.attendancePercentage || 0}%`} />
            <StatsCard label="🟢Present Days" value={report.presentDays || 0} />
            <StatsCard label="📅Working Days" value={report.totalWorkingDays || 0} />
          </div>
          <div className="attendance-reports__chart card">
            <AttendanceChart data={chartData} />
          </div>
        </>
      )}
    </section>
  );
}
