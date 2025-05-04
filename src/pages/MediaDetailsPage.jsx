import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://albackend-production.up.railway.app';

const MediaDetailsPage = ({ fetchAllMedia }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch media details
  useEffect(() => {
    const getMediaDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/${id}`);
        
        if (response.data.success) {
          setMedia(response.data.payload);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching media details:', error);
        setError('Failed to load media details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getMediaDetails();
  }, [id]);

  // Handle media deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/${id}`);
        
        if (response.data.success) {
          toast.success('Item deleted successfully');
          fetchAllMedia(); // Refresh the media list
          navigate('/'); // Redirect to homepage
        } else {
          toast.error(response.data.message || 'Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting media:', error);
        toast.error('Failed to delete item. Please try again.');
      }
    }
  };

  // Helper function to render rating stars
  const renderRating = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-2xl ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error || !media) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error || 'Media not found'}</span>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Get status text
  const getStatusText = (status, type) => {
    if (status === 'plan') return `Plan to ${type === 'movie' ? 'watch' : 'read'}`;
    return status === 'watched' ? 'Watched' : status === 'read' ? 'Read' : status;
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={media.image_url || `/api/placeholder/400/600`}
            alt={media.title}
            className="w-full h-64 md:h-full object-cover"
            onError={(e) => {
              e.target.src = `/api/placeholder/400/600`;
            }}
          />
        </div>
        
        <div className="p-6 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{media.title}</h1>
              <div className="mt-2 flex items-center space-x-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded capitalize">
                  {media.type}
                </span>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  {getStatusText(media.status, media.type)}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {media.rating && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-600">Rating:</h3>
              {renderRating(media.rating)}
            </div>
          )}
          
          {media.review && (
            <div className="mt-4">
              <h3 className="text-sm text-gray-600">Review:</h3>
              <p className="mt-1 text-gray-700 whitespace-pre-line">{media.review}</p>
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <div className="text-sm text-gray-500">
              Added on: {new Date(media.created_at).toLocaleDateString()}
            </div>
            
            <button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsPage;