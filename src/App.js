import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import Dashboard from './components/Dashboard';
import './App.css';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          📋 Task Manager
        </Link>
        <div className="nav-links">
          <Link
            to="/"
            className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            All Tasks
          </Link>
          <Link
            to="/completed"
            className={location.pathname === '/completed' ? 'nav-link active' : 'nav-link'}
          >
            Completed Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <TaskProvider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/completed" element={<Dashboard showCompletedOnly={true} />} />
          </Routes>
        </div>
      </Router>
    </TaskProvider>
  );
}

export default App;
