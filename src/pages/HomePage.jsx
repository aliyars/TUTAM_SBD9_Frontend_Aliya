import { useState } from 'react';
import { Link } from 'react-router-dom';
import MediaCard from '../components/MediaCard';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://albackend-production.up.railway.app';

const HomePage = ({ media, loading, error, fetchAllMedia, getFilteredMedia }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Function to handle media deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/${id}`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">My Media Collection</h1>
        <Link 
          to="/add" 
          className="bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-4 rounded transition"
        >
          Add New Item
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'all'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'movies'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('movies')}
        >
          Movies
        </button>
        <button
          className={`px-4 py-2 font-medium ${
            activeTab === 'books'
              ? 'text-pink-600 border-b-2 border-pink-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('books')}
        >
          Books
        </button>
      </div>

      {/* Media grid */}
      {displayMedia.length === 0 ? (
        <div className="text-center py-10">
          <h3 className="text-lg font-medium text-gray-500">No items found</h3>
          <p className="mt-1 text-gray-400">
            {activeTab !== 'all'
              ? `You haven't added any ${activeTab} yet.`
              : "Your collection is empty. Let's add some media!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayMedia.map((item) => (
            <MediaCard 
              key={item.id} 
              media={item} 
              onDelete={() => handleDelete(item.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;