import React, { useState, useContext, useRef } from 'react'; // Added useContext// For generating unique IDs (if needed)
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'; // Import Autocomplete
import { AuthContext } from './Authprovider';
import service from '../appwrite/data_config';
import conf from '../conf/conf';
import { useNavigate } from 'react-router-dom';

const libraries = ['places']; // Specify the 'places' library for Autocomplete

function MakeHelpPost() {
    const [location, setLocation] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext); // Access user context
    const navigate = useNavigate();
    const autocompleteRef = useRef(null); // Create a ref for Autocomplete

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: `${conf.goMapsApiKey}`, // Replace with your Google Maps API key
        libraries,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Please Signup/Login');
            return; 
        }

        if (!location || !postDescription) {
            setError('Please fill in all fields');
            return;
        }

        // Get the current time in ISO format
        const time = new Date().toISOString();
        try {
            // Create a help post with the user name, location, post description, and current time
            const helpposts = await service.myanHelpPosts({
                User_Name: user.name,
                Location: location,
                Post_Description: postDescription,
                Time: time
            });
            setSuccess('Help post created successfully!');
            setLocation('');
            setPostDescription('');
            alert("Help post has been created");
            navigate('/profile'); // Log the response for debugging
        } catch (error) {
            console.error('Error creating help post:', error);
            setError('Failed to create help post');
        }
    };

    // Handle place selection from Google Autocomplete
    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            setLocation(place.formatted_address);
        }
    };

    return (
        <div className="w-full lg:w-2/5 mx-4 lg:mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-center text-xl font-bold mb-4">Make a Help Post</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit}> 
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="location">
                        Location:
                    </label>
                    {isLoaded ? (
                        <Autocomplete
                            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)} // Save reference to Autocomplete
                            onPlaceChanged={handlePlaceSelect} // Handle place selection
                        >
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Search for a location"
                                required
                            />
                        </Autocomplete>
                    ) : (
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Loading location..."
                            disabled
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="postDescription">
                        Post Description:
                    </label>
                    <textarea
                        id="postDescription"
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Submit Help Post
                </button>
            </form>
        </div>
    );
}

export default MakeHelpPost;
