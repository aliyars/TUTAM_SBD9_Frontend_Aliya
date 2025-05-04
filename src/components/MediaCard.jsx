import { Link } from 'react-router-dom';

const MediaCard = ({ media, onDelete }) => {
  // Helper function to render stars for rating
  const renderRating = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Helper function to get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'watched':
        return 'bg-green-100 text-green-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'plan':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="relative pb-2/3 h-48">
        <img
          src={media.image_url || `/api/placeholder/400/320`}
          alt={media.title}
          className="absolute h-full w-full object-cover"
          onError={(e) => {
            e.target.src = `/api/placeholder/400/320`;
          }}
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{media.title}</h3>
          <span className="text-xs font-medium capitalize bg-blue-100 text-pink-800 px-2 py-1 rounded">
            {media.type}
          </span>
        </div>
        
        <div className="mt-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(media.status)}`}>
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
        
        <div className="mt-4 flex justify-between">
          <Link
            to={`/api/${media.id}`}
            className="text-blue-600 hover:text-pink-800 text-sm font-medium"
          >
            View Details
          </Link>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(media.id);
            }}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;