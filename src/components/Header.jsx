import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
 // Ensure you import the AuthContext
import { CgProfile } from 'react-icons/cg';
import { AuthContext } from './Authprovider';

function Header() {
  const { user, logout } = useContext(AuthContext); // Get the user and logout function from context
  const navigate = useNavigate();

  // Handle Logout
  const handleLogout = async () => {
    try {
      await logout(); // Call logout function from Authprovider
      navigate('/');  // Redirect to homepage after logout
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full mt-1 lg:mt-4 mb-16 text-gray-700 bg-white border-t border-gray-100 shadow-sm body-font">
      <div className="container flex flex-col items-center justify-between p-6 mx-auto md:flex-row">
        {/* Logo */}
        <img 
          src='https://i.ibb.co/8x8qFzw/1-removebg-preview.png' 
          className="flex items-center h-12 mb-4 font-medium text-gray-900 title-font md:mb-0" 
          alt="Logo"
        />

        {/* Navigation Links */}
        <nav className="flex flex-wrap items-center justify-center space-x-3  md:ml-auto md:mr-auto">
          <Link to="/" className="text-xl font-semibold p-2 rounded-lg hover:bg-gray-300">
            Home
          </Link>
          <Link to="/map" className="text-xl font-semibold p-2 rounded-lg hover:bg-gray-300">
           View Map
          </Link>
          <Link to="/helpposts" className="text-xl font-semibold p-2 rounded-lg hover:bg-gray-300">
           Help Post
          </Link>
          <Link to="/rescueteamlist" className="text-xl font-semibold p-2 rounded-lg hover:bg-gray-300 mb-4 lg:mb-0">
          Join A Rescue Team
          </Link>
        </nav>

        {/* Search, Profile and Logout/Login */}
        <div className="flex items-center space-x-5">

          {/* Profile Icon or Login Button */}
          {user ? (
            <>
              <Link to='/profile'>
                <CgProfile className="text-4xl hover:text-gray-900" />
              </Link>
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-xs font-bold text-white uppercase transition-all duration-150 bg-red-500 rounded shadow outline-none active:bg-red-600 hover:shadow-md focus:outline-none ease"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* If not logged in, show login/signup options */}
              <Link to='/login' className="font-medium hover:text-gray-900">
                Login
              </Link>
              <Link to='/signup' className="px-4 py-2 w-full text-xs font-bold text-white uppercase transition-all duration-150 bg-teal-500 rounded shadow outline-none active:bg-teal-600 hover:shadow-md focus:outline-none ease">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
