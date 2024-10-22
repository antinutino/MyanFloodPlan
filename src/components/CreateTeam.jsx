import React, { useState, useContext, useRef } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'; // Google Maps Autocomplete
import { AuthContext } from './Authprovider';
import service from '../appwrite/data_config';
import conf from '../conf/conf';
import { useNavigate } from 'react-router-dom';

const libraries = ['places']; // Specify the 'places' library for Autocomplete

function CreateTeam() {
    const [teamName, setTeamName] = useState('');
    const [areaOfRescue, setAreaOfRescue] = useState('');
    const [planDescription, setPlanDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { user } = useContext(AuthContext); // Access user context
    const navigate = useNavigate();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: `${conf.goMapsApiKey}`, // Replace with your Google Maps API key
        libraries,
    });

    const autocompleteRef = useRef(null); // Create a ref for Autocomplete

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('Please Signup/Login');
            return;
        }

        if (!teamName || !areaOfRescue || !planDescription) {
            setError('Please fill in all fields');
            return;
        }

        const time = new Date().toISOString();

        try {
            console.log(user.name);
            const teamData = await service.createTeam({
                Team_Name: teamName,
                Rescue_Location: areaOfRescue,
                Plan_Description: planDescription,
                Time: time,
                Team_Leader: user.name,
            });
            setSuccess('Team created successfully!');
            setTeamName('');
            setAreaOfRescue('');
            setPlanDescription('');
            alert("Team has been created!");
            navigate('/profile'); // Log the response for debugging
        } catch (error) {
            console.error('Error creating team:', error);
            setError('Failed to create team');
        }
    };

    // Handle place selection from Google Autocomplete
    const handlePlaceSelect = () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.formatted_address) {
            setAreaOfRescue(place.formatted_address);
        }
    };

    return (
        <div className="w-full lg:w-2/5 mx-4 lg:mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md">
            <h1 className="text-center text-xl font-bold mb-4">Create a Rescue Team</h1>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="teamName">
                        Team Name:
                    </label>
                    <input
                        type="text"
                        id="teamName"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="areaOfRescue">
                        Area of Rescue:
                    </label>
                    {isLoaded ? (
                        <Autocomplete
                            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
                            onPlaceChanged={handlePlaceSelect} // Use the modified onPlaceChanged
                        >
                            <input
                                type="text"
                                id="areaOfRescue"
                                value={areaOfRescue}
                                onChange={(e) => setAreaOfRescue(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Search for a location"
                                required
                            />
                        </Autocomplete>
                    ) : (
                        <input
                            type="text"
                            id="areaOfRescue"
                            value={areaOfRescue}
                            onChange={(e) => setAreaOfRescue(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Loading location..."
                            disabled
                        />
                    )}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1" htmlFor="planDescription">
                        Plan Description:
                    </label>
                    <textarea
                        id="planDescription"
                        value={planDescription}
                        onChange={(e) => setPlanDescription(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows="4"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Create Team
                </button>
            </form>
        </div>
    );
}

export default CreateTeam;
