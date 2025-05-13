import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';
import { fetchTasks, updateTaskStatus, deleteTask } from '../services/taskService';

// Declare icons
const CheckCircleIcon = getIcon('CheckCircle');
const ClockIcon = getIcon('Clock');
const AlertCircleIcon = getIcon('AlertCircle');
const CalendarIcon = getIcon('Calendar');
const TargetIcon = getIcon('Target');
const Trash2Icon = getIcon('Trash2');
const ClipboardListIcon = getIcon('ClipboardList');
const RefreshCwIcon = getIcon('RefreshCw');

function TaskList({ onTasksChange }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load tasks from the API
  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTasks();
      setTasks(data);
      if (onTasksChange) {
        onTasksChange(data);
      }
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      toast.error('Could not load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on initial render
  useEffect(() => {
    loadTasks();
  }, []);

  // Handle task status update
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      
      // Update local state
      setTasks(prev => 
        prev.map(task => 
          task.id === id ? { ...task, status } : task
        )
      );
      
      toast.info(`Task marked as ${status}`);
      
      // Notify parent component
      if (onTasksChange) {
        onTasksChange(tasks.map(task => task.id === id ? { ...task, status } : task));
      }
    } catch (err) {
      toast.error('Could not update task status');
    }
  };

  // Handle task deletion
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      
      // Update local state
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
      
      toast.error("Task deleted");
      
      // Notify parent component
      if (onTasksChange) {
        onTasksChange(updatedTasks);
      }
    } catch (err) {
      toast.error('Could not delete task');
    }
  };

  // Helper functions
  const getPriorityClass = (priority) => {
    switch(priority) {
      case 'High': return 'task-priority-high';
      case 'Medium': return 'task-priority-medium';
      case 'Low': return 'task-priority-low';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed': return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'In Progress': return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case 'Not Started': return <AlertCircleIcon className="w-5 h-5 text-yellow-500" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCwIcon className="w-8 h-8 animate-spin mx-auto text-primary" />
        <p className="mt-2">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
        <button 
          onClick={loadTasks}
          className="mt-2 btn btn-outline text-red-500 border-red-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.length > 0 ? (
          tasks.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`task-item ${getPriorityClass(task.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="checkbox-container mt-1">
                  <input 
                    type="checkbox" 
                    className="checkbox-input"
                    checked={task.status === 'Completed'}
                    onChange={() => handleStatusUpdate(
                      task.id, 
                      task.status === 'Completed' ? 'Not Started' : 'Completed'
                    )}
                  />
                </div>
                <div>
                  <h3 className={`font-medium ${task.status === 'Completed' ? 'line-through text-surface-400 dark:text-surface-500' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
                      <CalendarIcon className="w-3 h-3" />
                      {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-surface-500 dark:text-surface-400">
                      <TargetIcon className="w-3 h-3" />
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                  {getStatusIcon(task.status)}
                  <span>{task.status}</span>
                </div>
                <button 
                  onClick={() => handleDelete(task.id)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-10 text-surface-500 dark:text-surface-400">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex justify-center mb-3"
            >
              <ClipboardListIcon className="w-12 h-12 text-surface-400 dark:text-surface-500" />
            </motion.div>
            <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
            <p>Add your first task to get started!</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskList;