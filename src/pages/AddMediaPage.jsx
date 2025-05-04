import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const API_URL = 'https://albackend-production.up.railway.app';

const AddMediaPage = ({ fetchAllMedia }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'movie',
    status: 'plan',
    rating: '',
    review: '',
    image: null
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });

    // Create a preview URL for the image
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create loading toast
    const loadingToast = toast.loading('Adding your media...');

    try {
      // Create FormData object for file upload
      const mediaFormData = new FormData();
      mediaFormData.append('title', formData.title);
      mediaFormData.append('type', formData.type);
      mediaFormData.append('status', formData.status);
      
      if (formData.rating) {
        mediaFormData.append('rating', formData.rating);
      }
      
      if (formData.review) {
        mediaFormData.append('review', formData.review);
      }
      
      if (formData.image) {
        mediaFormData.append('image', formData.image);
      }

      const response = await axios.post(`${API_URL}/api/media`, mediaFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.dismiss(loadingToast);
        toast.success('Media added successfully!', {
          icon: '🎉',
          duration: 3000,
        });
        fetchAllMedia(); // Refresh the media list
        navigate('/'); // Redirect to homepage
      } else {
        toast.dismiss(loadingToast);
        toast.error(response.data.message || 'Failed to add media');
      }
    } catch (error) {
      console.error('Error adding media:', error);
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || 'Failed to add media. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto my-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-4xl font-bold text-gray-800 mb-6 relative"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <span className="relative">
          Add New Media
          <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </span>
      </motion.h1>
      
      <motion.form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-8 border border-gray-100"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.div className="mb-5" variants={itemVariants}>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
            placeholder="Enter media title"
          />
        </motion.div>

        {/* Type & Status in flex row on larger screens */}
        <motion.div className="flex flex-col md:flex-row gap-4 mb-5" variants={itemVariants}>
          {/* Type */}
          <div className="flex-1">
            <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              >
                <option value="movie">Movie</option>
                <option value="book">Book</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex-1">
            <label htmlFor="status" className="block text-gray-700 font-medium mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full appearance-none px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                required
              >
                <option value="plan">Plan to {formData.type === 'movie' ? 'Watch' : 'Read'}</option>
                <option value={formData.type === 'movie' ? 'watched' : 'read'}>
                  {formData.type === 'movie' ? 'Watched' : 'Read'}
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating - Only show if watched/read */}
        {(formData.status === 'watched' || formData.status === 'read') && (
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="rating" className="block text-gray-700 font-medium mb-2">
              Rating (1-5)
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill={parseInt(formData.rating) >= star ? "currentColor" : "none"}
                    stroke="currentColor"
                    className={`w-8 h-8 ${parseInt(formData.rating) >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={parseInt(formData.rating) >= star ? "0" : "1.5"} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              ))}
              <input
                type="hidden"
                id="rating"
                name="rating"
                value={formData.rating}
              />
            </div>
          </motion.div>
        )}

        {/* Review - Only show if watched/read */}
        {(formData.status === 'watched' || formData.status === 'read') && (
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="review" className="block text-gray-700 font-medium mb-2">
              Review
            </label>
            <textarea
              id="review"
              name="review"
              value={formData.review}
              onChange={handleChange}
              rows="4"
              placeholder="Share your thoughts about this media..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            ></textarea>
          </motion.div>
        )}

        {/* Image Upload */}
        <motion.div className="mb-6" variants={itemVariants}>
          <label htmlFor="image" className="block text-gray-700 font-medium mb-2">
            Cover Image
          </label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors duration-300 cursor-pointer">
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="mt-1 text-sm text-gray-600">
                    {formData.image ? formData.image.name : "Drag & drop or click to select an image"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: Square image, max 5MB
                  </p>
                </div>
              </div>
            </div>
            
            {previewUrl && (
              <motion.div 
                className="flex-shrink-0 w-32 h-32 overflow-hidden rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div 
          className="flex justify-end space-x-4 mt-8"
          variants={itemVariants}
        >
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
          >
            Cancel
          </button>
          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : 'Add Media'}
          </motion.button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
};

export default AddMediaPage;