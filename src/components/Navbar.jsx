import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <motion.nav 
      className="bg-gradient-to-r from-purple-700 to-pink-600 text-white shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h-2v-2h2zm0-4v2h-2V9h2zm-4 4v2H9v-2h2zm0-4v2H9V9h2zm-4 4v2H5v-2h2zm0-4v2H5V9h2z" clipRule="evenodd" />
              </svg>
            </motion.div>
            <span className="text-2xl font-bold tracking-tight">Movies and Books Tracker</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-pink-200 transition duration-300 relative ${
                location.pathname === '/' ? 'font-bold' : ''
              }`}
            >
              <span>Home</span>
              {location.pathname === '/' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                  layoutId="navIndicator"
                />
              )}
            </Link>
            <Link 
              to="/add" 
              className={`hover:text-pink-200 transition duration-300 relative ${
                location.pathname === '/add' ? 'font-bold' : ''
              }`}
            >
              <span>Add New</span>
              {location.pathname === '/add' && (
                <motion.div 
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white rounded-full"
                  layoutId="navIndicator"
                />
              )}
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;