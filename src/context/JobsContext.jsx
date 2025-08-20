import React, { createContext, useContext, useEffect, useReducer } from 'react';

const JobsContext = createContext();

const STORAGE_KEY = 'job-tracker:jobs';

const STATUS = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

function generateId() {
  // Fallback-friendly unique-ish ID
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

const initialState = {
  jobs: [],
};

function initFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return { jobs: data };
    if (Array.isArray(data.jobs)) return { jobs: data.jobs };
    return initialState;
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      return { jobs: [action.payload, ...state.jobs] };
    }
    case 'UPDATE': {
      const { id, updates } = action.payload;
      return {
        jobs: state.jobs.map(j => (j.id === id ? { ...j, ...updates } : j)),
      };
    }
    case 'DELETE': {
      return { jobs: state.jobs.filter(j => j.id !== action.payload) };
    }
    case 'REPLACE_ALL': {
      return { jobs: action.payload };
    }
    default:
      return state;
  }
}

export function JobsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
  }, [state.jobs]);

  const addJob = (job) => {
    const id = job.id || generateId();
    const payload = {
      id,
      company: job.company.trim(),
      title: job.title.trim(),
      status: STATUS.includes(job.status) ? job.status : 'Applied',
      date: job.date, // YYYY-MM-DD
      notes: job.notes || '',
    };
    dispatch({ type: 'ADD', payload });
    return id;
  };

  const updateJob = (id, updates) => {
    dispatch({ type: 'UPDATE', payload: { id, updates } });
  };

  const deleteJob = (id) => {
    dispatch({ type: 'DELETE', payload: id });
  };

  const replaceAll = (jobsArray) => {
    // Basic validation and normalization
    const cleaned = (jobsArray || [])
      .filter(j => j && j.company && j.title)
      .map(j => ({
        id: j.id || generateId(),
        company: String(j.company).trim(),
        title: String(j.title).trim(),
        status: STATUS.includes(j.status) ? j.status : 'Applied',
        date: j.date || new Date().toISOString().slice(0, 10),
        notes: j.notes ? String(j.notes) : '',
      }));
    dispatch({ type: 'REPLACE_ALL', payload: cleaned });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(state.jobs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    a.download = `job-applications-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    jobs: state.jobs,
    addJob,
    updateJob,
    deleteJob,
    replaceAll,
    exportJSON,
    STATUS,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error('useJobs must be used within JobsProvider');
  return ctx;
}
