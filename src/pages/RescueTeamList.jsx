import React, { useEffect, useState, useRef, useContext } from 'react';
import { Autocomplete, useJsApiLoader } from '@react-google-maps/api'; // Importing Autocomplete from react-google-maps
import { FaSearch } from 'react-icons/fa'; // Search icon
import { useNavigate } from 'react-router-dom'; // React Router's useNavigate
import service from '../appwrite/data_config';
import conf from '../conf/conf';
import { AuthContext } from '../components/Authprovider';

function RescueTeamList() {
    const [rescueTeamList, setRescueTeamList] = useState([]);
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState('');
    const [areaOfRescue, setAreaOfRescue] = useState('');
    const [joinedTeams, setJoinedTeams] = useState([]); // Track joined teams
    const autocompleteRef = useRef(null);
    const { user } = useContext(AuthContext); // AuthContext provides the user object
    const navigate = useNavigate(); // useNavigate hook from react-router-dom
    const libraries = ['places'];
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: `${conf.goMapsApiKey}`, // Replace with your Google Maps API key
        libraries,
    });

    useEffect(() => {
        if (!user) {
            // If the user is not available, redirect to the login page
            navigate('/login');
            return;
        }

        async function fetchRescueTeams() {
            try {
                const data = await service.getrescueteams();
                setRescueTeamList(data); // Assuming data is an array of rescue teams
                setFilteredTeams(data); // Initialize the filtered teams
            } catch (error) {
                console.error('Error fetching rescue teams:', error);
                setError('Failed to fetch rescue teams.');
            }
        }

        fetchRescueTeams();
    }, [user, navigate]);

    const handleSearch = async () => {
        try {
            const data = await service.getsearchteams(areaOfRescue);
            setRescueTeamList(data); // Filter the teams based on the search
        } catch (error) {
            console.error('Error fetching rescue teams:', error);
            setError('Failed to fetch rescue teams.');
        }
    };

    const handleJoinClick = async (team) => {
        try {
            const response = await service.createUserProfile({
                Name: user.name,
                Email: user.email,
                TeamsID: team.$id
            });
            setJoinedTeams((prev) => [...prev, team.$id]); // Add the joined team ID to the state
            alert(`You have joined ${team.Team_Name}!`);
        } catch (error) {
            console.error('Error joining the team:', error);
            setError('Failed to join the team.');
        }
    };

    const handleTeamClick = (team) => {
        setSelectedTeam(team === selectedTeam ? null : team); // Toggle team description
    };

    const handlePlaceSelect = (place) => {
        if (place) {
            const location = place.formatted_address || '';
            setAreaOfRescue(location); // Set the selected area
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className='w-full'>
                <h1 className="text-center text-xl font-bold mb-4">Rescue Teams</h1>
            </div>

            {isLoaded && (
                <div className="w-full mb-6 flex flex-row justify-center">
                    <Autocomplete
                        onPlaceChanged={() => {
                            const place = autocompleteRef.current.getPlace();
                            handlePlaceSelect(place);
                        }}
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
                    <button
                        onClick={handleSearch}
                        className="ml-4 bg-green-700 text-white px-4 py-2 rounded hover:bg-green-500"
                    >
                        Search
                    </button>
                </div>
            )}

            {/* Rescue Team List */}
            <div className="space-y-4">
                {rescueTeamList.length === 0 ? (
                    <p className="text-center">Loading...</p>
                ) : (
                    rescueTeamList.map((team) => (
                        <div
                            key={team.Team_Name}
                            className="bg-white p-4 rounded-lg shadow-md"
                        >
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => handleTeamClick(team)}
                            >
                                <div>
                                    <h2 className="text-lg font-bold">
                                        {team.Team_Name}
                                    </h2>
                                    <p className="text-gray-600">
                                        {new Date(team.Time).toLocaleString()}
                                    </p>
                                    <p className="text-gray-600">
                                        Rescue Location: {team.Rescue_Location}
                                    </p>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log(team);
                                        handleJoinClick(team);
                                    }}
                                    className={`bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 ${joinedTeams.includes(team.$id) ? 'bg-green-500 hover:bg-green-600' : ''}`}
                                >
                                    {joinedTeams.includes(team.$id) ? 'Successfully Joined' : 'Join'}
                                </button>
                            </div>
                            {selectedTeam === team && (
                                <div className="mt-4">
                                    <h3 className="font-bold">Plan Description:</h3>
                                    <p>{team.Plan_Description}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default RescueTeamList;
