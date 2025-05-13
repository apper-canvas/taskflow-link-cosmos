import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Declare icons
const LayoutDashboardIcon = getIcon('LayoutDashboard');
const CalendarIcon = getIcon('Calendar');
const ListChecksIcon = getIcon('ListChecks');
const BellIcon = getIcon('Bell');
const PlusIcon = getIcon('Plus');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');
const TargetIcon = getIcon('Target');
const AlertCircleIcon = getIcon('AlertCircle');

function Home() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Draft the initial proposal for the new client project',
        status: 'In Progress',
        priority: 'High',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        title: 'Review team updates',
        description: 'Go through weekly updates from the development team',
        status: 'Not Started',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        title: 'Send client invoice',
        description: 'Prepare and send invoice for the completed project phase',
        status: 'Completed',
        priority: 'Low',
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
      }
    ];
  });
  
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0
  });
  
  // Calculate statistics
  useEffect(() => {
    const now = new Date();
    
    const newStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'Completed').length,
      inProgress: tasks.filter(task => task.status === 'In Progress').length,
      upcoming: tasks.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate > now && task.status !== 'Completed';
      }).length
    };
    
    setStats(newStats);
    
    // Save tasks to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...task
    };
    
    setTasks(prev => [...prev, newTask]);
    toast.success("Task added successfully!");
  };
  
  const updateTaskStatus = (id, status) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status } : task
      )
    );
    toast.info(`Task marked as ${status}`);
  };
  
  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.error("Task deleted");
  };
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/4">
          <div className="sticky top-24 card space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Dashboard</h2>
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="p-2 rounded-full bg-primary/10 text-primary"
              >
                <LayoutDashboardIcon className="w-5 h-5" />
              </motion.div>
            </div>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 text-primary font-medium">
                <ListChecksIcon className="w-5 h-5" />
                <span>All Tasks</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                <CalendarIcon className="w-5 h-5" />
                <span>Calendar</span>
              </a>
              <a href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">
                <BellIcon className="w-5 h-5" />
                <span>Reminders</span>
              </a>
            </nav>
            
            <div className="pt-4 border-t border-surface-200 dark:border-surface-700">
              <h3 className="text-lg font-medium mb-3">Task Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300">Total Tasks</div>
                </div>
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
                  <div className="text-sm text-green-700 dark:text-green-300">Completed</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.inProgress}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300">In Progress</div>
                </div>
                <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20">
                  <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.upcoming}</div>
                  <div className="text-sm text-amber-700 dark:text-amber-300">Upcoming</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-3/4 space-y-6">
          <section>
            <MainFeature onAddTask={addTask} />
          </section>
          
          <section className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Tasks</h2>
              <button className="btn btn-primary flex items-center gap-2">
                <PlusIcon className="w-4 h-4" />
                <span>New Task</span>
              </button>
            </div>
            
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
                            onChange={() => updateTaskStatus(
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
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                        >
                          {getIcon('Trash2')({ className: "w-4 h-4" })}
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
                      {getIcon('ClipboardList')({ className: "w-12 h-12 text-surface-400 dark:text-surface-500" })}
                    </motion.div>
                    <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
                    <p>Add your first task to get started!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;