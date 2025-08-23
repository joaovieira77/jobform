import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobCard from '../components/JobCard.jsx';

export default function Dashboard() {
  const { jobs, STATUS } = useJobs();
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    let result = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);
    // Sort by date descending (newest first)
    return result.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [jobs, filter]);

  return (
    <section>
      <div className="section-header">
        <h2>Dashboard</h2>
        <div className="filters" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn"
            style={{ fontSize: '1.3rem', padding: '4px 12px', lineHeight: 1 }}
            title="Add Job"
            aria-label="Add Job"
            onClick={() => navigate('/add')}
          >
            ＋
          </button>
          <label className="sr-only" htmlFor="statusFilter">Filter by status</label>
          <select
            id="statusFilter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All</option>
            {STATUS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <p>No applications yet. Add your first one.</p>
        </div>
      ) : (
        <div className="grid cards">
          {filtered.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </section>
  );
}
