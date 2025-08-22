import { Link, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useJobs } from '../context/JobsContext.jsx';


export default function Header() {
  const { exportJSON, replaceAll } = useJobs();
  const fileRef = useRef(null);
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === 'dark' ? 'light' : 'dark'));

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
    <header className="app-header">
      <div className="container header-inner">
        <Link to="/" className="brand">Job Tracker</Link>
        <nav className="nav">
          <Link to="/" className={pathname === '/' ? 'active' : ''}>Dashboard</Link>
          <Link to="/add" className={pathname === '/add' ? 'active' : ''}>Add Job</Link>
        </nav>
        <div className="header-actions">
          <button className="btn secondary" onClick={exportJSON}>Export JSON</button>
          <button className="btn secondary" onClick={onImportClick}>Import JSON</button>
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            aria-label="Toggle light/dark theme"
          >
            {theme === 'dark'
              ? (
                  <span aria-label="Light mode" role="img">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="11" cy="11" r="5" fill="currentColor"/>
                      <g stroke="currentColor" strokeWidth="1.5">
                        <line x1="11" y1="1.5" x2="11" y2="4"/>
                        <line x1="11" y1="18" x2="11" y2="20.5"/>
                        <line x1="1.5" y1="11" x2="4" y2="11"/>
                        <line x1="18" y1="11" x2="20.5" y2="11"/>
                        <line x1="4.93" y1="4.93" x2="6.6" y2="6.6"/>
                        <line x1="15.4" y1="15.4" x2="17.07" y2="17.07"/>
                        <line x1="4.93" y1="17.07" x2="6.6" y2="15.4"/>
                        <line x1="15.4" y1="6.6" x2="17.07" y2="4.93"/>
                      </g>
                    </svg>
                  </span>
                )
              : (
                  <span aria-label="Dark mode" role="img">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 14.5C16.5 15 15.3 15.25 14 15.25C10.2721 15.25 7.25 12.2279 7.25 8.5C7.25 7.2 7.5 6 8 5C5.5 6.5 4 9.2 4 12C4 16.4183 7.58172 20 12 20C14.8 20 17.5 18.5 19 16C18.5 16.5 18 16.5 17.5 14.5Z" fill="currentColor"/>
                    </svg>
                  </span>
                )}
          </button>
          <input
            type="file"
            ref={fileRef}
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
        </div>
      </div>
    </header>
  );
}
