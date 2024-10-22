import { useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
import { useRef, useState } from 'react';
import { FaLocationArrow, FaTimes, FaSearchLocation } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import conf from '../conf/conf';
const center = { lat: 23.777176, lng: 90.399452 }; // Default location

function Map() {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey:`${conf.goMapsApiKey}`, // Set this in your environment variables
    libraries: ['places'], // To enable Autocomplete
  });

  const [map, setMap] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [userLocation, setUserLocation] = useState(center); // Store user location
  const [searchedLocation, setSearchedLocation] = useState(null); // Store searched location
  const [showModal, setShowModal] = useState(false); // State to show/hide modal
  const [clickedLocation, setClickedLocation] = useState(null); // Store clicked location

  const originRef = useRef();
  const destinationRef = useRef();
  const locationRef = useRef(); // Reference for location input

  if (!isLoaded) {
    return <div className="text-center">Loading map...</div>;
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '') {
      return;
    }
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = '';
    destinationRef.current.value = '';
  }

  // Get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          map.panTo(newLocation);
          map.setZoom(15);
        },
        () => {
          alert('Geolocation permission denied');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handleNavigation = (path) => {
    navigate(path, {
      state: { lat: clickedLocation.lat, lng: clickedLocation.lng }, // Pass lat/lng
    });
    setShowModal(false); // Close modal after navigating
  };

  // Search for a location
  const searchLocation = async () => {
    const location = locationRef.current.value;
    if (!location) return;

    const query = location;
    const url = `https://maps.gomaps.pro/maps/api/place/textsearch/json?` +
      new URLSearchParams({
        location: location,
        query: query,
        key: `${conf.goMapsApiKey}`// Replace with your actual API key
      });
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const newLocation = {
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
        };
        setSearchedLocation(newLocation);
        setUserLocation(newLocation);
        map.panTo(newLocation);
        map.setZoom(16);
        locationRef.current.value = '';
      } else {
        alert('Location not found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Handle click event on the map
  const handleMapClick = (event) => {
    const clickedLat = event.latLng.lat();
    const clickedLng = event.latLng.lng();
    setClickedLocation({ lat: clickedLat, lng: clickedLng });
    setShowModal(true); // Show modal with buttons
  };

  return (
    <div className="relative h-screen w-full">
      {/* Google Map container */}
      <div className="h-full w-full">
        <GoogleMap
          center={userLocation}
          zoom={16}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
          onClick={handleMapClick} // Add click handler here
        >
          <Marker position={userLocation} />
          {searchedLocation && <Marker position={searchedLocation} />}
          {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
        </GoogleMap>
      </div>

      {showModal && (
  <div className="absolute top-0 pb-4 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
    <div className="relative bg-white p-4 rounded-lg shadow-lg">
      {/* Cross icon in the top-right corner */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={() => setShowModal(false)} // Close modal on click
      >
        <FaTimes size={24} />
      </button>

      <h2 className="text-xl mb-4">Choose an Action</h2>
      <div className="flex space-x-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={() => handleNavigation('/flood')}
        >
          Flood Analysis
        </button>

        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded"
          onClick={() => handleNavigation('/helpposts')}
        >
          Help Posts
        </button>
      </div>
    </div>
  </div>
)}

      {/* Control box for inputs and actions */}
      <div className="absolute -top-16 left-0 w-full  p-2 lg:p-4 lg:px-12  z-10 bg-slate-200 bg-opacity-90 rounded-lg  flex flex-row  justify-center">
        <div className="flex-grow">
          <Autocomplete>
            <input
              type="text"
              placeholder="Origin"
              ref={originRef}
              className="w-full p-1 text-lg border border-gray-300 rounded-lg"
            />
          </Autocomplete>
        </div>
        <div className="flex-grow">
          <Autocomplete>
            <input
              type="text"
              placeholder="Destination"
              ref={destinationRef}
              className="w-full p-1 text-lg border border-gray-300 rounded-lg"
            />
          </Autocomplete>
        </div>
        <button
          className="bg-pink-500 text-white p-1 mx-1 text-lg rounded flex items-center justify-center"
          onClick={calculateRoute}
        >
          Calculate
        </button>
        <button
          className="bg-red-500 text-white p-1 mr-1 text-lg rounded flex items-center justify-center"
          onClick={clearRoute}
        >
          <FaTimes size={24} />
        </button>
        <button
          className="bg-blue-500 text-white p-2 mr-1 text-lg rounded flex items-center justify-center"
          onClick={getUserLocation}
        >
          <FaSearchLocation size={24} />
        </button>
      </div>

      {/* Location search input */}
      <div className="absolute -top-7 left-0 w-full p-2 lg:p-4 lg:px-12 mt-4 z-10 bg-slate-200 bg-opacity-90 rounded-lg flex justify-center space-x-4">
        <Autocomplete className='w-full'>
        <input
          type="text"
          placeholder="Search for a location"
          ref={locationRef}
          className="w-full p-2 text-lg border border-gray-300 rounded-lg"
        />
        </Autocomplete>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded"
          onClick={searchLocation}
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default Map;
