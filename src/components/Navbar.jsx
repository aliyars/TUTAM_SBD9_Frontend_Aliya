import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-pink-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Movies and Books Tracker</Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className={`hover:text-pink-200 transition ${
                location.pathname === '/' ? 'font-bold underline' : ''
              }`}
            >
              Home
            </Link>
            <Link 
              to="/add" 
              className={`hover:text-pink-200 transition ${
                location.pathname === '/add' ? 'font-bold underline' : ''
              }`}
            >
              Add New
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;