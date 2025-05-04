import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MediaCard = ({ media, onDelete }) => {
  // Helper function to render stars for rating
  const renderRating = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <motion.span 
          key={i} 
          className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 * i, duration: 0.3 }}
        >
          ★
        </motion.span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'watched':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'read':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'plan':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Get display text for status
  const getStatusText = (status, type) => {
    if (status === 'plan') return `Plan to ${type === 'movie' ? 'watch' : 'read'}`;
    return status === 'watched' || status === 'read' ? 
      `${status.charAt(0).toUpperCase() + status.slice(1)}` : 
      status;
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative pb-2/3 h-48 overflow-hidden">
        <motion.img
          src={media.image_url || `/api/media/placeholder/400/320`}
          alt={media.title}
          className="absolute h-full w-full object-cover"
          onError={(e) => {
            e.target.src = `/api/media/placeholder/400/320`;
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute top-0 right-0 p-2">
          <span className="text-xs font-medium capitalize bg-blue-100 text-blue-800 px-2 py-1 rounded-full border border-blue-300 shadow-sm">
            {media.type}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">{media.title}</h3>
        
        <div className="mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(media.status)}`}>
            {getStatusText(media.status, media.type)}
          </span>
        </div>
        
        {media.rating && (
          <div className="mt-2">
            {renderRating(media.rating)}
          </div>
        )}
        
        {media.review && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{media.review}</p>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/api/media/${media.id}`}
            className="text-blue-600 hover:text-purple-800 text-sm font-medium transition duration-300"
          >
            View Details
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              onDelete(media.id);
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center space-x-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MediaCard;