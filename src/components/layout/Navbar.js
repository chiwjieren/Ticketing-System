import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              JomTickets
            </Link>
            {token && (
              <div className="ml-10 flex space-x-4">
                <Link to="/" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Home
                </Link>
                <Link to="/events" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Events
                </Link>
                <Link to="/my-tickets" className="hover:bg-blue-700 px-3 py-2 rounded">
                  My Tickets
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {token ? (
              <div className="flex space-x-4">
                <Link to="/bind-device" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Device Binding
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Login
                </Link>
                <Link to="/signup" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 