import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

// Declare icons
const PlusIcon = getIcon('Plus');
const XIcon = getIcon('X');
const CalendarIcon = getIcon('Calendar');
const FlagIcon = getIcon('Flag');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');
const TargetIcon = getIcon('Target');
const MoreHorizontalIcon = getIcon('MoreHorizontal');

function MainFeature({ onAddTask }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }
    
    onAddTask(formData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Not Started'
    });
    
    setIsFormOpen(false);
  };
  
  return (
    <div className="card relative overflow-hidden">
      <div className="absolute top-0 right-0 h-32 w-32 -mt-12 -mr-12 bg-primary/10 rounded-full blur-2xl transform rotate-45"></div>
      <div className="absolute bottom-0 left-0 h-32 w-32 -mb-12 -ml-12 bg-secondary/10 rounded-full blur-2xl"></div>
      
      <div className="relative">
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
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Save Task
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Quick Tips</h3>
              <MoreHorizontalIcon className="w-5 h-5 text-surface-500" />
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <TargetIcon className="w-4 h-4 text-primary mt-0.5" />
                <span>Use priorities to focus on what matters most</span>
              </li>
              <li className="flex items-start gap-2">
                <CalendarIcon className="w-4 h-4 text-primary mt-0.5" />
                <span>Set realistic due dates to manage your time effectively</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-primary mt-0.5" />
                <span>Break large tasks into smaller, manageable items</span>
              </li>
            </ul>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Productivity Stats</h3>
              <MoreHorizontalIcon className="w-5 h-5 text-surface-500" />
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">68%</span>
                </div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '68%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-sm">
                  <span>On-time Completion</span>
                  <span className="font-medium">82%</span>
                </div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Coming Soon</h3>
              <MoreHorizontalIcon className="w-5 h-5 text-surface-500" />
            </div>
            <div className="flex flex-col h-full justify-center">
              <img 
                src="https://images.unsplash.com/photo-1606327054629-64c8b0fd6e4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FsZW5kYXIsc2NoZWR1bGV8fHx8fHwxNjE5MjMwNDYw&ixlib=rb-1.2.1&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=300" 
                alt="Calendar features coming soon" 
                className="w-full h-24 object-cover rounded-lg mb-2"
              />
              <p className="text-sm">Calendar integration and team collaboration features coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainFeature;