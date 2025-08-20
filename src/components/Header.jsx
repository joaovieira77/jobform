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
          <button className="btn" onClick={toggleTheme} title="Toggle light/dark theme">
            {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
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
