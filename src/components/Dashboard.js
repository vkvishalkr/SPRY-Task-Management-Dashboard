import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import './Dashboard.css';

const Dashboard = ({ showCompletedOnly = false }) => {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('dueDate');

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    if (showCompletedOnly) {
      filtered = filtered.filter((task) => task.status === 'Completed');
    }

    if (statusFilter !== 'All') {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'dueDate') {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

    return filtered;
  }, [tasks, showCompletedOnly, statusFilter, sortBy]);

  const summary = useMemo(() => {
    const pending = tasks.filter((t) => t.status === 'Pending').length;
    const inProgress = tasks.filter((t) => t.status === 'In Progress').length;
    const completed = tasks.filter((t) => t.status === 'Completed').length;
    return { pending, inProgress, completed, total: tasks.length };
  }, [tasks]);

  const handleAddTask = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (editingTask) {
      updateTask(editingTask.id, formData);
    } else {
      addTask(formData);
    }
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(id);
    }
  };

  return (
    <div className="dashboard">
      <div className="summary-section">
        <h1 className="dashboard-title">
          {showCompletedOnly ? 'Completed Tasks' : 'Task Management Dashboard'}
        </h1>
        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-label">Total Tasks</div>
            <div className="summary-value">{summary.total}</div>
          </div>
          <div className="summary-card pending">
            <div className="summary-label">Pending</div>
            <div className="summary-value">{summary.pending}</div>
          </div>
          <div className="summary-card in-progress">
            <div className="summary-label">In Progress</div>
            <div className="summary-value">{summary.inProgress}</div>
          </div>
          <div className="summary-card completed">
            <div className="summary-label">Completed</div>
            <div className="summary-value">{summary.completed}</div>
          </div>
        </div>
      </div>

      <div className="controls-section">
        {!showCompletedOnly && (
          <button className="btn btn-primary" onClick={handleAddTask}>
            ➕ Add New Task
          </button>
        )}
        <div className="filters">
          {!showCompletedOnly && (
            <div className="filter-group">
              <label htmlFor="statusFilter">Filter by Status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="filter-select"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          )}
          <div className="filter-group">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>
      </div>

      <div className="tasks-section">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. {!showCompletedOnly && 'Add a new task to get started!'}</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleFormSubmit}
        task={editingTask}
      />
    </div>
  );
};

export default Dashboard;

