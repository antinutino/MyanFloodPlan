import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../components/Authprovider';
import service from '../appwrite/data_config'; // Assuming your service is properly configured
import { Link } from 'react-router-dom';

function MyTeams() {
    const { user } = useContext(AuthContext);
    const [myteamsID, setmyteamsID] = useState([]);
    const [myteams, setmyteams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null); // Store the selected team details
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true); // Track loading state
    
    // Fetch team IDs by user's email
    useEffect(() => {
        async function fetchMyRescueTeamsID() {
            try {
                const data = await service.getMyTeams(user.email);
                setmyteamsID(data); // Assuming data is an array of team IDs
            } catch (error) {
                console.error('Error fetching rescue team IDs:', error);
                setError('Failed to fetch rescue team IDs.');
            }
        }
        fetchMyRescueTeamsID();
    }, [user.email]);

    // Fetch each team based on the ID and store them in an array
    useEffect(() => {
        if (myteamsID.length > 0) {
            const fetchMyRescueTeams = async () => {
                const teamsArray = await Promise.all(
                    myteamsID.map(async (team) => {
                        try {
                            const teamData = await service.getMyTeamsbyID(team.TeamsID);
                            return teamData; // Return the fetched team data
                        } catch (error) {
                            console.error('Error fetching rescue team data:', error);
                            setError('Failed to fetch rescue team data.');
                            return null;
                        }
                    })
                );
                setmyteams(teamsArray.filter(team => team !== null)); // Update state with array of teams, filtering out any null results
                setIsLoading(false); // Data has been fetched
            };
            fetchMyRescueTeams();
        } else {
            setIsLoading(false); // No teams to fetch
        }
    }, [myteamsID]);

    // Handle click on a team name to display its details
    const handleTeamClick = (team) => {
        setSelectedTeam(team); // Set the clicked team as the selected one
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-2xl font-bold mb-6">My Rescue Teams</h1>
            {error && <p className="text-red-500">{error}</p>}

            {isLoading ? (
                <p className="text-center">Loading teams...</p>
            ) : (
                <>
                    {myteams.length === 0 ? (
                        <p className="text-center text-xl font-semibold text-gray-600">You have not yet joined any team.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {myteams.map((team, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                                    onClick={() => handleTeamClick(team)}
                                >
                                    <div className='flex flex-row justify-between'>
                                        <h2 className="text-xl font-bold text-gray-800">
                                            {team.Team_Name}
                                        </h2>
                                        <div className='flex flex-row'>
                                            {/* Pass TeamsID using state */}
                                            <Link 
                                                to={`/tagedposts/${team.$id}`} 
                                                className='p-2 mx-2 bg-lime-600 hover:bg-lime-700 rounded-lg'
                                            >
                                                Tagged Posts
                                            </Link>
                                            <Link 
                                                to={`/inbox/${team.$id}`} 
                                                className='p-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg'
                                            >
                                                Inbox
                                            </Link>
                                        </div>
                                    </div>
                                    {selectedTeam === team && (
                                        <div className="mt-6 p-4 bg-gray-100 rounded shadow-md">
                                            <h3 className="text-2xl font-bold mb-4">{selectedTeam.Team_Name} Details</h3>
                                            <p className="mb-2">
                                                <strong>Rescue Location:</strong> {selectedTeam.Rescue_Location}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Plan Description:</strong> {selectedTeam.Plan_Description}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Time:</strong> {new Date(selectedTeam.Time).toLocaleString()}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Team Leader:</strong> {selectedTeam.Team_Leader}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default MyTeams;
