import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import getIcon from '../utils/iconUtils';

// Declare icons
const LayoutDashboardIcon = getIcon('LayoutDashboard');
const CalendarIcon = getIcon('Calendar');
const ListChecksIcon = getIcon('ListChecks');
const BellIcon = getIcon('Bell');

function Home() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0
  });

  // Update statistics when tasks change
  const updateStats = (tasksData) => {
    const now = new Date();

    const newStats = {
      total: tasksData.length,
      completed: tasksData.filter(task => task.status === 'Completed').length,
      inProgress: tasksData.filter(task => task.status === 'In Progress').length,
      upcoming: tasksData.filter(task => {
        const dueDate = new Date(task.dueDate);
        return dueDate > now && task.status !== 'Completed';
      }).length
    };

    setStats(newStats);
  };

  // Handle task changes (from TaskList component)
  const handleTasksChange = (updatedTasks) => {
    setTasks(updatedTasks);
    updateStats(updatedTasks);
  };

  // Handle new task added (from TaskForm component)
  const handleTaskAdded = (newTask) => {
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateStats(updatedTasks);
  };

  // Handle task form submission (used in MainFeature)
  const handleMainFeatureAdd = (task) => {
    const newTask = {
      id: task.id || Date.now().toString(),
      createdAt: task.createdAt || new Date().toISOString(),
      ...task
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    updateStats(updatedTasks);
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
            <div className="card relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 -mt-12 -mr-12 bg-primary/10 rounded-full blur-2xl transform rotate-45"></div>
              <div className="absolute bottom-0 left-0 h-32 w-32 -mb-12 -ml-12 bg-secondary/10 rounded-full blur-2xl"></div>
              
              <div className="relative">
                <TaskForm onTaskAdded={handleTaskAdded} />
              </div>
            </div>
          </section>
          
          <section className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Your Tasks</h2>
            </div>
            <TaskList onTasksChange={handleTasksChange} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Home;