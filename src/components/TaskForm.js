import React, { useState, useEffect } from 'react';
import './TaskForm.css';

const TaskForm = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      let dueDateValue = '';
      if (task.dueDate) {
        dueDateValue = task.dueDate.includes('T') 
          ? task.dueDate.split('T')[0] 
          : task.dueDate;
      }
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'Pending',
        dueDate: dueDateValue,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
        dueDate: '',
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      status: 'Pending',
      dueDate: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="close-btn" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter task title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Enter task description (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">
              Due Date <span className="required">*</span>
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.dueDate && (
              <span className="error-message">{errors.dueDate}</span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-submit">
              {task ? 'Update Task' : 'Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

