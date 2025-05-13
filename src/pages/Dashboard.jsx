import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';
import { AuthContext } from '../App';
import Home from './Home';

// Declare icons
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const LogOutIcon = getIcon('LogOut');
const UserIcon = getIcon('User');

function Dashboard() {
  const { toggleDarkMode, logout } = useContext(AuthContext);
  const darkMode = localStorage.getItem('darkMode') === 'true';
  const { user } = useSelector((state) => state.user);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const toggleUserMenu = () => setShowUserMenu(!showUserMenu);
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.firstName) return 'U';
    return `${user.firstName.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`;
  };

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      <header className="sticky top-0 z-10 bg-white dark:bg-surface-800 shadow-sm dark:shadow-none border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
            TaskFlow
          </h1>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: darkMode ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                {darkMode ? (
                  <SunIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <MoonIcon className="w-5 h-5 text-surface-700" />
                )}
              </motion.div>
            </button>
            
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 rounded-full w-8 h-8 transition-colors"
              >
                <span className="text-sm font-medium">{getInitials()}</span>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg py-2 border border-surface-200 dark:border-surface-700 z-10">
                  <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-sm text-surface-500 truncate">{user?.emailAddress}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center gap-2"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Home />
      </main>
    </div>
  );
}

export default Dashboard;