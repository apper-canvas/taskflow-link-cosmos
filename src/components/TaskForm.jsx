import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { createTask } from '../services/taskService';

// Declare icons
const PlusIcon = getIcon('Plus');
const XIcon = getIcon('X');
const CalendarIcon = getIcon('Calendar');
const FlagIcon = getIcon('Flag');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');

function TaskForm({ onTaskAdded }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Not Started'
  });
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    try {
      setLoading(true);
      
      // Create task in the backend
      const newTask = await createTask(formData);
      
      // Call the callback with the new task
      if (onTaskAdded) {
        onTaskAdded(newTask);
      }
      
      toast.success("Task added successfully!");
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'Not Started'
      });
      
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold">Task Manager</h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFormOpen(prev => !prev)}
          className={`btn ${isFormOpen ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
        >
          {isFormOpen ? (
            <>
              <XIcon className="w-4 h-4" />
              <span>Cancel</span>
            </>
          ) : (
            <>
              <PlusIcon className="w-4 h-4" />
              <span>Add New Task</span>
            </>
          )}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-200 dark:border-surface-700">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="title">
                  Task Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`input-field ${errors.title ? 'border-red-500 dark:border-red-500' : ''}`}
                  placeholder="Enter task title"
                  disabled={loading}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="input-field"
                  placeholder="Describe your task (optional)"
                  disabled={loading}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="priority">
                    <span className="flex items-center gap-1">
                      <FlagIcon className="w-4 h-4" />
                      Priority
                    </span>
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="status">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      Status
                    </span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field"
                    disabled={loading}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="dueDate">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Due Date *
                    </span>
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    className={`input-field ${errors.dueDate ? 'border-red-500 dark:border-red-500' : ''}`}
                    disabled={loading}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.dueDate}</p>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Save Task</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskForm;