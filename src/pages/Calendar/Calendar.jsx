import { useEffect, useMemo, useState } from "react";
import {
  createCalendarDate,
  getCalendarDates,
  updateCalendarDate,
} from "../../services/api";
import { EmptyState } from "../../components/EmptyState/EmptyState";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ConfirmModal } from "../../components/ConfirmModal/ConfirmModal";
import "./Calendar.css";

const monthNames = [
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

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", dayType: "Working", hasEvent: false });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCalendar();
  }, []);

  async function loadCalendar() {
    setLoading(true);
    setError("");
    try {
      const data = await getCalendarDates();
      setEvents(data || []);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  const firstDayOfMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    [currentDate]
  );

  const currentMonthLabel = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const startWeekday = firstDayOfMonth.getDay();

    for (let blank = 0; blank < startWeekday; blank++) {
      days.push({ empty: true, key: `blank-${blank}` });
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const record = events.find((item) => new Date(item.eventDate).toDateString() === date.toDateString());
      days.push({ day, date, record, empty: false, key: date.toISOString() });
    }

    return days;
  }, [currentDate, events, firstDayOfMonth]);

  function openDatePanel(date, record) {
    setSelectedDate(date);
    setSelectedRecord(record || null);
    setForm({
      title: record?.title || "",
      description: record?.description || "",
      dayType: record?.dayType || (date.getDay() === 0 ? "Holiday" : "Working"),
      hasEvent: record?.hasEvent ?? false,
    });
    setMessage("");
    setPanelOpen(true);
  }

  function handleNavigation(offset) {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  }

  function handleMonthChange(event) {
    const monthIndex = Number(event.target.value);
    setCurrentDate((prev) => new Date(prev.getFullYear(), monthIndex, 1));
  }

  function handleYearChange(event) {
    const yearValue = Number(event.target.value);
    setCurrentDate((prev) => new Date(yearValue, prev.getMonth(), 1));
  }

  function handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveEvent(event) {
    event.preventDefault();
    setMessage("");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        eventDate: selectedDate.toISOString(),
        dayType: form.dayType,
        hasEvent: form.hasEvent,
      };

      if (selectedRecord) {
        await updateCalendarDate(selectedRecord._id, payload);
      } else {
        await createCalendarDate(payload);
      }
      await loadCalendar();
      setPanelOpen(false);
    } catch (submitError) {
      setMessage(submitError.message);
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteEvent() {
    if (!selectedRecord) {
      setPanelOpen(false);
      return;
    }
    setSaving(true);
    try {
      await updateCalendarDate(selectedRecord._id, {
        ...selectedRecord,
        hasEvent: false,
        title: "",
        description: "",
      });
      await loadCalendar();
      setConfirmDelete(false);
      setPanelOpen(false);
    } catch (deleteError) {
      setMessage(deleteError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="calendar-page">
      <div className="calendar-page__header card">
        <div>
          <h2>School Calendar</h2>
          <p>Manage holidays, events, and working Sundays with a modern calendar interface.</p>
        </div>
        <div className="calendar-page__controls">
          <button type="button" className="secondary" onClick={() => handleNavigation(-1)}>
            Previous Month
          </button>
          <button type="button" className="secondary" onClick={() => handleNavigation(1)}>
            Next Month
          </button>
        </div>
      </div>

      <div className="calendar-page__toolbar card">
        <div className="calendar-page__jump">
          <label>
            Month
            <select value={currentDate.getMonth()} onChange={handleMonthChange}>
              {monthNames.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Year
            <input type="number" value={currentDate.getFullYear()} onChange={handleYearChange} min="2020" />
          </label>
        </div>
        <div className="calendar-page__selected-month">{currentMonthLabel}</div>
      </div>

      {loading ? (
        <div className="calendar-page__loading">
          <LoadingSpinner />
          <span>Loading calendar dates...</span>
        </div>
      ) : error ? (
        <div className="calendar-page__error card">
          <h2>Unable to load calendar</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="calendar-grid card">
          <div className="calendar-grid__header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((weekday) => (
              <div key={weekday} className="calendar-grid__weekday">
                {weekday}
              </div>
            ))}
          </div>
          <div className="calendar-grid__body">
            {calendarDays.map((cell) => (
              <button
                key={cell.key}
                type="button"
                className={`calendar-grid__cell ${cell.empty ? "calendar-grid__cell--empty" : ""} ${cell.record?.dayType === "Holiday" ? "calendar-grid__cell--holiday" : ""} ${cell.date?.getDay() === 0 ? "calendar-grid__cell--sunday" : ""}`}
                disabled={cell.empty}
                onClick={() => cell.date && openDatePanel(cell.date, cell.record)}
              >
                {!cell.empty && (
                  <>
                    <span>{cell.day}</span>
                    {cell.record?.hasEvent && <span className="calendar-grid__event-dot" />}
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {panelOpen && selectedDate && (
        <div className="panel-drawer">
          <div className="panel-drawer__content card">
            <div className="panel-drawer__header">
              <div>
                <h3>{selectedRecord ? "Edit Date" : "Add Date"}</h3>
                <p>{selectedDate.toDateString()}</p>
              </div>
              <button type="button" className="secondary" onClick={() => setPanelOpen(false)}>
                Close
              </button>
            </div>
            <form className="calendar-form" onSubmit={saveEvent}>
              <label>
                Event Title
                <input name="title" value={form.title} onChange={handleInputChange} />
              </label>
              <label>
                Description
                <textarea name="description" rows="4" value={form.description} onChange={handleInputChange} />
              </label>
              <div className="form-row">
                <label>
                  Day Type
                  <select name="dayType" value={form.dayType} onChange={handleInputChange}>
                    <option value="Working">Working</option>
                    <option value="Holiday">Holiday</option>
                  </select>
                </label>
                <label className="calendar-checkbox">
                  <input name="hasEvent" type="checkbox" checked={form.hasEvent} onChange={handleInputChange} />
                  <span>Add Event</span>
                </label>
              </div>
              {message && <p className="form-message">{message}</p>}
              <div className="panel-drawer__cta">
                {selectedRecord && (
                  <button type="button" className="secondary" onClick={() => setConfirmDelete(true)}>
                    Delete Event
                  </button>
                )}
                <button type="submit" className="primary" disabled={saving}>
                  Save Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Event?"
          message="This will remove the event from the selected date in the calendar."
          onCancel={() => setConfirmDelete(false)}
          onConfirm={confirmDeleteEvent}
          confirmLabel="Delete"
        />
      )}
    </section>
  );
}
