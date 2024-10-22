import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/Authprovider";

export default function Profile() {
  const { user, logout } = useContext(AuthContext); // Get user context and logout function
  const navigate = useNavigate();
  const [helppost, sethelppost] = useState(false);

  const handleLogout = async () => {
    try {
      await logout(); // Call logout function from AuthContext
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.log(error);
      // Handle logout error
    }
  };

  const handleWeatherUpdate = () => {
    // Use the geolocation API to get the user's current position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(position.coords);
          // Navigate to the map component, passing lat and lng as params
          navigate(`/floodpred/${latitude}/${longitude}`);
        
        },
        (error) => {
          console.log('Error getting location:', error);
          // Handle location access errors here, like showing a message
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
      // Handle case where geolocation is not supported
    }
  };

  return (
    <div className="container mx-auto p-6 w-full lg:w-2/3 bg-slate-200 rounded-lg">
      {user ? (
        <div className="flex flex-col lg:flex-row justify-between">
          {/* Left Section: Profile Info */}
          <div className="lg:w-1/3 p-4 text-center bg-gray-200 rounded-lg shadow-lg mb-4 lg:mb-0">
            <h2 className="text-xl font-bold mb-2">Profile Information</h2>
            <div className="mt-2">
              <p className="text-xl font-semibold bg-gray-300 p-2 rounded-lg mx-4">{user.name}</p>
              <p className="text-lg text-black p-2 ">{user.email}</p>
              <p className="text-lg text-black">{user.phone}</p>
            </div>
          </div>

          {/* Right Section: Actions */}
          <div className="lg:w-2/3 p-4 bg-white rounded-lg shadow-lg">
            <div className="grid grid-cols-1 py-8">
              {/* Box for creating a rescue team */}
              <button
                className="flex justify-center items-center my-2 bg-orange-400 hover:bg-orange-600 text-white py-8 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
                onClick={() => navigate('/myteams')}
              >
                My Teams
              </button>
              <button
                className="flex justify-center items-center my-2 bg-blue-500 hover:bg-blue-600 text-white py-8 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => navigate('/maketeam')}
              >
                Create a Rescue Team
              </button>

              <button
                className="flex justify-center items-center my-2 bg-green-500 hover:bg-green-600 text-white py-8 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={handleWeatherUpdate}
              >
                Weather Update of My Location
              </button>
              <button
                className="flex justify-center items-center bg-yellow-500 my-2 hover:bg-yellow-600 text-white py-8 px-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                onClick={() => navigate('/makepost')}
              >
                Make a Help Post
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
