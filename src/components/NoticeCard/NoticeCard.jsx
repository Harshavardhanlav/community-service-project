

export function NoticeCard({ notice, onEdit, onDelete }) {
  // Normalize the priority text safely to lowercase matching your CSS hooks
  const priorityClass = notice.priority ? notice.priority.toLowerCase() : 'medium';

  // Dynamic status indicators matching standard system layouts
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return '🚨';
      case 'low': return '📌';
      default: return '⚠️';
    }
  };

  return (
    <div className={`notice-card ${priorityClass}`}>
      <div className="notice-icon">
        {getPriorityIcon(priorityClass)}
      </div>
      
      <div className="notice-content">
        <h4>{notice.title}</h4>
        
        {/* ✅ FIXED: Displays the descriptive body text of your notice entry */}
        {notice.message && <p>{notice.message}</p>}
        
        <span className="notice-date">
          {notice.date ? new Date(notice.date).toLocaleDateString() : new Date().toLocaleDateString()}
        </span>
      </div>

      <div className="notice-card__actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span className={`priority-badge priority-${priorityClass}`}>
          {notice.priority || 'Medium'}
        </span>
        
        <button onClick={onEdit} className="secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>
          Edit
        </button>
        <button onClick={onDelete} className="secondary" style={{ padding: '6px 12px', fontSize: '12px', borderColor: '#fee2e2', color: '#ef4444' }}>
          Delete
        </button>
      </div>
    </div>
  );
}