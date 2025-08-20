import { useMemo, useState } from 'react';
import { useJobs } from '../context/JobsContext.jsx';
import JobCard from '../components/JobCard.jsx';

export default function Dashboard() {
  const { jobs, STATUS } = useJobs();
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    let result = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);
    // Sort by date descending (newest first)
    return result.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [jobs, filter]);

  return (
    <section>
      <div className="section-header">
        <h2>Dashboard</h2>
        <div className="filters">
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
