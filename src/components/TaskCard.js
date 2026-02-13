import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`status-badge ${getStatusColor(task.status)}`}>
          {task.status}
        </span>
      </div>
      <p className="task-description">{task.description || 'No description'}</p>
      <div className="task-card-footer">
        <span className="task-due-date">
          <i className="icon">📅</i> {formatDate(task.dueDate)}
        </span>
        <div className="task-actions">
          <button
            className="btn btn-edit"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
          >
            ✏️ Edit
          </button>
          <button
            className="btn btn-delete"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

