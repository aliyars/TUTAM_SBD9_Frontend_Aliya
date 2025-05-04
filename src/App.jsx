import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AddMediaPage from './pages/AddMediaPage';
import MediaDetailsPage from './pages/MediaDetailsPage';
import NotFoundPage from './pages/NotFoundPage';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';

// API base URL
const API_URL = 'https://albackend-production.up.railway.app';

function App() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all media on component mount
  useEffect(() => {
    fetchAllMedia();
  }, []);

  // Function to fetch all media
  const fetchAllMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api`);
      if (response.data.success) {
        setMedia(response.data.payload);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError('Failed to fetch media. Please try again later.');
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter media by type
  const getFilteredMedia = (type) => {
    return media.filter(item => item.type === type);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <Routes>
            <Route 
              path="/" 
              element={<HomePage 
                media={media} 
                loading={loading} 
                error={error} 
                fetchAllMedia={fetchAllMedia}
                getFilteredMedia={getFilteredMedia}
              />} 
            />
            <Route 
              path="/add" 
              element={<AddMediaPage fetchAllMedia={fetchAllMedia} />} 
            />
            <Route 
              path="/api/:id" 
              element={<MediaDetailsPage fetchAllMedia={fetchAllMedia} />} 
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  );
}

export default App;