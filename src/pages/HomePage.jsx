import { useState } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'https://albackend-production.up.railway.app';

const HomePage = ({ media, loading, error, fetchAllMedia, getFilteredMedia }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Function to handle media deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/media/${id}`);
        if (response.data.success) {
          toast.success('Item deleted successfully');
          fetchAllMedia(); // Refresh the media list
        } else {
          toast.error(response.data.message || 'Failed to delete item');
        }
      } catch (error) {
        toast.error('Failed to delete item. Please try again.');
        console.error('Error deleting media:', error);
      }
    }
  };

  // Get media based on active tab
  const getDisplayMedia = () => {
    switch (activeTab) {
      case 'movies':
        return getFilteredMedia('movie');
      case 'books':
        return getFilteredMedia('book');
      default:
        return media;
    }
  };

  const displayMedia = getDisplayMedia();

  // Background animation element
  const BackgroundAnimation = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -inset-[10px] opacity-50">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-purple-300 to-pink-300"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 backdrop-blur-[100px]" />
    </div>
  );

  if (loading) {
    return (
      <>
        <BackgroundAnimation />
        <div className="flex flex-col justify-center items-center h-64">
          <motion.div 
            className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="mt-4 text-pink-700 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading your collection...
          </motion.p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BackgroundAnimation />
        <motion.div 
          className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md" 
          role="alert"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2"> {error}</span>
          </div>
          <button
            onClick={() => fetchAllMedia()}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <>
      <BackgroundAnimation />
      <div className="space-y-6">
        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center">
            <motion.span
              className="inline-block mr-3 text-pink-600"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </motion.span>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">My Media Collection</h1>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/add" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Item
            </Link>
          </motion.div>
        </motion.div>

        {/* Filter tabs */}
        <motion.div 
          className="flex border-b border-gray-200 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {['all', 'movies', 'books'].map((tab) => (
            <motion.button
              key={tab}
              className={`px-6 py-3 font-medium relative ${
                activeTab === tab
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab(tab)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"
                  layoutId="activeTabIndicator"
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Media grid */}
        {displayMedia.length === 0 ? (
          <motion.div 
            className="text-center py-16 bg-white bg-opacity-80 rounded-xl shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </motion.div>
            <h3 className="mt-4 text-xl font-medium text-gray-700">No items found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {activeTab !== 'all'
                ? `You haven't added any ${activeTab} yet.`
                : "Your collection is empty. Let's add some media!"}
            </p>
            <motion.div 
              className="mt-6"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/add" 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-700 transition duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Your First Item
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {displayMedia.map((item) => (
                <motion.div
                  key={item.id}
                  exit={{ opacity: 0, scale: 0.8 }}
                  layout
                >
                  <MediaCard 
                    media={item} 
                    onDelete={() => handleDelete(item.id)} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default HomePage;