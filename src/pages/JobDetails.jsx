import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobsContext.jsx';
import JobForm from '../components/JobForm.jsx';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { jobs, updateJob, deleteJob } = useJobs();
  const job = useMemo(() => jobs.find(j => j.id === id), [jobs, id]);
  const [editing, setEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (!job) {
    return (
      <section>
        <h2>Job not found</h2>
        <p>This job may have been deleted or the link is invalid.</p>
        <button className="btn" onClick={() => navigate('/')}>Back to dashboard</button>
      </section>
    );
  }

  const handleUpdate = (values) => {
    updateJob(job.id, values);
    setEditing(false);
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    deleteJob(job.id);
    navigate('/');
  };

  return (
    <section>
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Delete application for "{job.title}" at {job.company}?</p>
            <div className="modal-actions">
              <button className="btn danger" onClick={confirmDelete}>Delete</button>
              <button className="btn" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {!editing ? (
        <>
          <div className="section-header">
            <h2>{job.title}</h2>
            <div className="detail-actions">
              <button className="btn" onClick={() => setEditing(true)}>Edit</button>
              <button className="btn danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <button className="btn go-back" style={{marginBottom: '16px'}} onClick={() => navigate('/')}> 
            ← Go Back
          </button>
          <div className="detail-card">
            <div className="detail-row">
              <span className="label">Company</span>
              <span>{job.company}</span>
            </div>
            <div className="detail-row">
              <span className="label">Status</span>
              <span>{job.status}</span>
            </div>
            <div className="detail-row">
              <span className="label">Applied on</span>
              <span>{job.date}</span>
            </div>
            <div className="detail-notes">
              <span className="label">Notes</span>
              <p className="notes">{job.notes || '—'}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="section-header">
            <h2>Edit job</h2>
            <div className="detail-actions">
              <button className="btn secondary" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
          <JobForm initial={job} onSubmit={handleUpdate} submitLabel="Save changes" />
        </>
      )}
    </section>
  );
}
