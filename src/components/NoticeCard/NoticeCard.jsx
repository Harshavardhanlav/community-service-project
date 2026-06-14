import "./NoticeCard.css";

export function NoticeCard({ notice }) {
  return (
    <div className="dashboard-notice">
      <div className="dashboard-notice__content">
        <h4>{notice.title}</h4>

        <span>
          {new Date(
            notice.createdAt || Date.now()
          ).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}