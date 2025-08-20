import { Link } from 'react-router-dom';

const statusColor = {
  Applied: 'badge blue',
  Interviewing: 'badge yellow',
  Offer: 'badge green',
  Rejected: 'badge red',
};

export default function JobCard({ job }) {
  return (
    <Link to={`/job/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h3 className="job-title">{job.title}</h3>
        <span className={statusColor[job.status] || 'badge'}>{job.status}</span>
      </div>
      <p className="company">{job.company}</p>
      <p className="muted">Applied: {job.date}</p>
    </Link>
  );
}
