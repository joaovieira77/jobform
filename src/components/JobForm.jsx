import { useState } from 'react';
import { useJobs } from '../context/JobsContext.jsx';

export default function JobForm({ initial = null, onSubmit, submitLabel = 'Save' }) {
  const { STATUS } = useJobs();
  const [values, setValues] = useState(() => ({
    company: initial?.company || '',
    title: initial?.title || '',
    status: initial?.status || 'Applied',
    date: initial?.date || new Date().toISOString().slice(0, 10),
    notes: initial?.notes || '',
  }));

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!values.company.trim()) e.company = 'Company is required';
    if (!values.title.trim()) e.title = 'Job title is required';
    if (!values.status) e.status = 'Status is required';
    if (!values.date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(values);
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="grid">
        <div className="field">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={values.company}
            onChange={handleChange}
            placeholder="Company name"
          />
          {errors.company && <div className="error">{errors.company}</div>}
        </div>
        <div className="field">
          <label>Job title</label>
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder="e.g., Frontend Developer"
          />
          {errors.title && <div className="error">{errors.title}</div>}
        </div>
        <div className="field">
          <label>Status</label>
          <select name="status" value={values.status} onChange={handleChange}>
            {STATUS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.status && <div className="error">{errors.status}</div>}
        </div>
        <div className="field">
          <label>Application date</label>
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
          />
          {errors.date && <div className="error">{errors.date}</div>}
        </div>
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea
          name="notes"
          value={values.notes}
          onChange={handleChange}
          placeholder="Interviewers, links, reminders, etc."
          rows={6}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary">{submitLabel}</button>
      </div>
    </form>
  );
}
