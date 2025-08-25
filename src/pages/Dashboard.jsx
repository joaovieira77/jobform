import { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobCard from '../components/JobCard.jsx';

export default function Dashboard() {
  const { jobs, STATUS, exportJSON, replaceAll } = useJobs();
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const filtered = useMemo(() => {
    let result = filter === 'All' ? jobs : jobs.filter(j => j.status === filter);
    return result.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [jobs, filter]);
  const statusCounts = useMemo(() => {
  const counts = { Total: jobs.length };
  STATUS.forEach(s => {
    counts[s] = jobs.filter(j => j.status === s).length;
  });
  return counts;
}, [jobs, STATUS]);



  const onImportClick = () => fileRef.current?.click();

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!Array.isArray(data)) {
        alert('Invalid file format. Expected an array of jobs.');
        return;
      }
      replaceAll(data);
      alert('Import successful.');
    } catch (err) {
      alert('Failed to import. Please ensure the file is a valid JSON export.');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section>
      <div className="section-header">
        <h2>Dashboard</h2>
        <div
          className="filters"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
          }}
        >{/* Add Job button */}
          <button
            className="btn"
            style={{ fontSize: '1.3rem', padding: '4px 12px', lineHeight: 1 }}
            title="Add Job"
            aria-label="Add Job"
            onClick={() => navigate('/add')}
          >
            ＋
          </button>
          {/* Import/Export buttons on the left */}
          <button className="btn secondary" onClick={exportJSON}>Export JSON</button>
          <button className="btn secondary" onClick={onImportClick}>Import JSON</button>
          <input
            type="file"
            ref={fileRef}
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />

  


          {/* Status filter dropdown */}
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
      <div className="stats-bar">
  {['Total', ...STATUS].map(s => (
    <div key={s} className="stat-box">
      <h4>{s}</h4>
      <p>{statusCounts[s]}</p>
    </div>
  ))}
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
