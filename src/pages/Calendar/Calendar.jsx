import { useEffect, useMemo, useState } from "react";
import {
  createCalendarDate,
  getCalendarDates,
  updateCalendarDate,
  deleteCalendarDate
} from "../../services/api";
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

// Contextual Event Emoji Determiner
const getEventEmoji = (eventTitle) => {
  if (!eventTitle) return '📅';
  const title = eventTitle.toLowerCase();
  if (title.includes('exam') || title.includes('test')) return '📝';
  if (title.includes('sports') || title.includes('games')) return '🏆';
  if (title.includes('meeting') || title.includes('staff')) return '🤝';
  if (title.includes('fair') || title.includes('science')) return '🚀';
  return '📢';
};

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const toDateOnlyISOString = (date) => {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0, 0));
    return utcDate.toISOString();
  };

  const getLocalDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  };
  const [form, setForm] = useState({ title: "", description: "", dayType: "Working", hasEvent: false });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCalendar();
  }, []);

async function loadCalendar() {

  setLoading(true);

  setError("");

  try {

    const data = await getCalendarDates();

    console.log("Calendar Data:", data);

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
      const record = events.find(
        (item) => getLocalDate(item.eventDate).toDateString() === date.toDateString()
      );
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
    dayType: record?.dayType || "Working",
    hasEvent: true
  });

  setIsEditing(false);

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

async function saveEvent() {

  setMessage("");
  setSaving(true);

  try {

    const payload = {
      title: form.title,
      description: form.description,
      eventDate: toDateOnlyISOString(selectedDate),
      dayType: form.dayType,

      // Always mark event as existing
      hasEvent: true,
    };

    if (selectedRecord) {

      await updateCalendarDate(
        selectedRecord._id,
        payload
      );

    } else {

      await createCalendarDate(payload);

    }

    await loadCalendar();

    setPanelOpen(false);

    setSelectedRecord(null);

    setIsEditing(false);

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
await deleteCalendarDate(
   selectedRecord._id
);
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
          <h2>📅 School Calendar</h2>
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
            {calendarDays.map((cell) => {
              const isSunday = cell.date?.getDay() === 0;
              const isHoliday = cell.record?.dayType === "Holiday";
              const isWorking = cell.record?.dayType === "Working" || (!cell.empty && !isHoliday);
              const hasEvent = cell.record?.hasEvent;

              const cellClasses = [
                "calendar-grid__cell",
                cell.empty ? "calendar-grid__cell--empty" : "",
                isSunday ? "calendar-grid__cell--sunday" : "",
                isHoliday ? "calendar-grid__cell--holiday" : "",
                isWorking ? "calendar-grid__cell--working" : "",
                hasEvent ? "calendar-grid__cell--event" : ""
              ].filter(Boolean).join(" ");

              return (
                <button
                  key={cell.key}
                  type="button"
                  className={cellClasses}
                  disabled={cell.empty}
                  onClick={() => cell.date && openDatePanel(cell.date, cell.record)}
                >
                  {!cell.empty && (
                    <>
                      <div className="calendar-grid__cell-top">
                        <span>{cell.day}</span>
                        {hasEvent && (
                          <span className="calendar-grid__event-emoji" title={cell.record.title}>
                            {getEventEmoji(cell.record.title)}
                          </span>
                        )}
                      </div>
                      {hasEvent && <div className="calendar-grid__event-dot"></div>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Control Form Side Drawer Overlay */}
      {panelOpen && (
        <div className="panel-drawer" onClick={() => setPanelOpen(false)}>
          <div className="panel-drawer__content" onClick={(e) => e.stopPropagation()}>
            <div className="panel-drawer__header">
              <h3>{selectedDate ? selectedDate.toLocaleDateString('en-US', { dateStyle: 'long' }) : "Manage Date"}</h3>
            </div>
{selectedRecord && !isEditing ? (

  <div className="event-details">

    <h3>{selectedRecord.title}</h3>

    <p>{selectedRecord.description}</p>

    <div className="event-type">
      {selectedRecord.dayType}
    </div>

    <div className="event-actions">

      <button
        type="button"
        className="primary"
        onClick={() => setIsEditing(true)}
      >
        Edit Event
      </button>

      <button
        type="button"
        className="secondary delete-btn"
        onClick={() => setConfirmDelete(true)}
      >
        Delete Event
      </button>

    </div>

  </div>

) : (

  <>
    <label>
      Event Title
      <input
        type="text"
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
        value={form.description}
        onChange={handleInputChange}
      />
    </label>

    <label>
      Day Type
      <select
        name="dayType"
        value={form.dayType}
        onChange={handleInputChange}
      >
        <option value="Working">
          Working Day
        </option>

        <option value="Holiday">
          Holiday
        </option>
      </select>
    </label>

    <div className="panel-drawer__cta">

      <button
        type="button"
        className="secondary"
        onClick={() => setPanelOpen(false)}
      >
        Cancel
      </button>

<button
  type="button"
  className="primary"
  onClick={saveEvent}
>
  Save Event
</button>

    </div>
  </>

)}
          </div>
        </div>
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Clear Event Configuration?"
          message="Are you sure you want to clear this scheduled event layout record details from your tracking ledger?"
          onConfirm={confirmDeleteEvent}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </section>
  );
}