import React, { useContext } from 'react';
import Chart1 from './Chart1';
import Chart2 from './Chart2';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './Authprovider';

function Body() {

  const navigate=useNavigate();
  const {user}=useContext(AuthContext);

  const handlenavigate=()=>{
    if(user)
    {
       navigate('/profile')
    }
    else{
          navigate('/login')
    }

  }
  

  return (
    <div className="w-full p-6 mt-12">
      {/* Introduction Section */}
      <div className="bg-white rounded-lg p-6 w-full lg:w-2/3  mx-auto my-6">
  <h2 className="text-2xl font-bold text-center mb-4 border-b-2">Myan Flood Plan: A Lifeline for Communities</h2>
  <p className="text-gray-700 mb-4">
    Myan Flood Plan is a platform designed to help Myanmar communities manage flooding through real-time information and community engagement.
  </p>
  
  <h3 className="text-xl font-semibold mb-2">Key Features:</h3>
  <ul className="list-disc list-inside text-gray-600 mb-4">
    <li>Emergency Alerts: Instant notifications for impending floods.</li>
    <li>Real-Time Updates: Critical weather and river level information.</li>
    <li>Community Engagement: Users can share experiences and communicate with rescue teams.</li>
    <li>Shelter Access: Easy location of nearby shelters.</li>
    <li>Collaboration: Promotes teamwork for mutual aid during crises.</li>
  </ul>
  
  <h3 className="text-xl font-semibold mb-2">Mission:</h3>
  <p className="text-gray-700 mb-4">
    To empower communities with essential tools for effective flood response and recovery.
  </p>

  <h3 className="text-xl font-semibold mb-2">Future Plans:</h3>
  <p className="text-gray-700">
    Enhance flood forecasting technology and collaborate with local authorities to improve impact.
  </p>
</div>

      {/* Flood Images Grid Section */}
      <div className="w-full mx-auto flex flex-col lg:flex-row justify-evenly items-center mb-3 lg:mb-4">
  <div className='m-4 w-full lg:w-1/2 mx-auto'>
  <div className='flex flex-row w-full'>
    <div className="relative w-full  lg:w-1/2 sm:w-1/2 p-2">
      <img 
        src="https://i.ibb.co.com/jHt5vty/download-2.jpg" 
        alt="Flooded streets in Myanmar" 
        className="w-full h-52 lg:h-2/3 rounded-lg shadow-md mb-4" 
      />
      <p className="mt-2 text-sm text-gray-600">
        A street in Myanmar submerged in floodwaters, illustrating the severity of recent floods and the need for real-time updates.
      </p>
    </div>
    <div className="relative w-full lg:w-1/2  p-2">
      <img 
        src="https://i.ibb.co.com/Rp80k95/download-3.jpg" 
        alt="Rescue teams assisting flood victims" 
        className="w-full h-52 lg:h-2/3 rounded-lg shadow-md mb-4" 
      />
      <p className="mt-2 text-sm text-gray-600">
        Rescue teams helping flood victims reach safe shelters, showcasing the importance of community-driven efforts and quick response times.
      </p>
    </div>
   </div>
    <div className='flex flex-row w-full '>
    <div className="relative w-full lg:w-1/2 p-2">
      <img 
        src="https://i.ibb.co.com/GJRkZ3T/download-1.jpg" 
        alt="Flood shelter in Myanmar" 
        className="w-full h-52 lg:h-2/3 rounded-lg shadow-md mb-4" 
      />
      <p className="mt-2 text-sm text-gray-600">
        A flood shelter in Myanmar where families find safety during emergencies, highlighting the importance of the shelter location feature.
      </p>
    </div>

    <div className="relative w-full lg:w-1/2 p-2">
      <img 
        src="https://i.ibb.co.com/hByPF2v/OIP-9.jpg" 
        alt="Volunteers delivering aid during floods" 
        className="w-full h-52 lg:h-2/3 rounded-lg shadow-md mb-4" 
      />
      <p className="mt-2 text-sm text-gray-600">
        Volunteers distributing aid and essentials to flood-affected areas, showing the impact of collaboration and mutual aid.
      </p>
    </div>
    </div>
  
  </div>

  {/* Right Section with Get Started Button */}
  <div className="flex flex-col items-center lg:items-start mx-auto w-full sm:w-1/3 p-2">
    <h2 className="text-2xl font-semibold mb-6 text-center border-b-2">Get Started</h2>
    <p className="text-3xl text-gray-600 mb-4">
          Myan Flood Plan is a crucial lifeline for communities in Myanmar at risk of flooding. Our innovative platform
          provides real-time updates on weather conditions and river water levels, empowering users with essential
          information to stay safe.
        </p>
    <p className="mb-4 lg:mr-8 text-xl text-gray-600">
      Join us in our efforts to provide assistance and support during floods. Together, we can make a difference.
    </p>
    <button onClick={handlenavigate} className="bg-blue-600 mx-auto lg:ml-8 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition">
      Get Started
    </button>
  </div>
</div>

      {/* Charts Section */}
      <div className="w-full flex flex-col justify-center items-end lg:flex-row">
        <Chart1 className="p-4 lg:p-12" />
        <Chart2 className="p-4 lg:p-12" />
      </div>
    </div>
  );
}

export default Body;
