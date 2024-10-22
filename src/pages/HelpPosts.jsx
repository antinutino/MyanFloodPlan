import React, { useEffect, useState } from 'react';
import service from '../appwrite/data_config'; // Ensure your data service is imported

function HelpPosts() {
    const [helpPosts, setHelpPosts] = useState([]);
    const [rescueTeams, setRescueTeams] = useState([]);
    const [error, setError] = useState('');
    const [selectedRescueTeam, setSelectedRescueTeam] = useState(null);
    const [postToTag, setPostToTag] = useState(null);
    const [taggedPosts, setTaggedPosts] = useState([]); // Track which posts have been tagged

    useEffect(() => {
        const fetchHelpPosts = async () => {
            try {
                const posts = await service.getHelpPosts(); // Fetch help posts
                setHelpPosts(posts);
            } catch (error) {
                console.error('Error fetching help posts:', error);
                setError('Failed to fetch help posts.');
            }
        };

        fetchHelpPosts();
    }, []);

    const fetchRescueTeams = async (location) => {
        try {
            const teams = await service.getsearchteams(location); // Fetch rescue teams based on the post's location
            setRescueTeams(teams);
        } catch (error) {
            console.error('Error fetching rescue teams:', error);
            setError('Failed to fetch rescue teams.');
        }
    };

    const handleTagClick = (post) => {
        setPostToTag(post); // Set the current post to be tagged
        fetchRescueTeams(post.Location); // Fetch rescue teams for the selected post's location
    };

    const handleRescueTeamSelect = async (team) => {
        if (postToTag && team) {
            try {
                // Call a service to tag the post to the selected rescue team
                await service.createteamdata({
                    RescueTeamID: team.$id,
                    HelpPostsID: postToTag.$id,
                });

                alert(`Post tagged to ${team.Team_Name}`);

                // Update taggedPosts to prevent the post from being tagged again
                setTaggedPosts([...taggedPosts, postToTag.$id]);
                setPostToTag(null); // Reset postToTag after tagging
                setSelectedRescueTeam(null); // Clear selected team after tagging
            } catch (error) {
                console.error('Error tagging post to rescue team:', error);
                setError('Failed to tag the post.');
            }
        } else {
            alert('Please select a rescue team before confirming.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-2xl font-bold mb-6">Help Posts</h1>
            {error && <p className="text-red-500">{error}</p>}

            {helpPosts.length === 0 ? (
                <p className="text-center">Loading help posts...</p>
            ) : (
                <div className="text-center grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
                    {helpPosts.map((post, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-2">
                                {post.User_Name}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {new Date(post.Time).toLocaleString()}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Location: </span>
                                {post.Location}
                            </p>
                            <p className="text-gray-600 mb-4">
                                <span className="font-semibold">Description: </span>
                                {post.Post_Description}
                            </p>

                            {/* Show either "Tag a Rescue Team" or "Tag has been sent" */}
                            {taggedPosts.includes(post.$id) ? (
                                <button
                                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed"
                                    disabled
                                >
                                    Tag has been sent
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleTagClick(post)}
                                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Tag a Rescue Team
                                    </button>

                                    {/* Rescue Team Dropdown */}
                                    {postToTag === post && rescueTeams.length > 0 && (
                                        <div className="mt-4">
                                            <select
                                                value={selectedRescueTeam ? selectedRescueTeam.Team_Name : ""}
                                                onChange={(e) => {
                                                    const selectedTeamName = e.target.value;
                                                    const selectedTeam = rescueTeams.find(
                                                        (team) => team.Team_Name === selectedTeamName
                                                    );
                                                    setSelectedRescueTeam(selectedTeam); // Set the selected rescue team
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded"
                                            >
                                                <option value="">Select a rescue team</option>
                                                {rescueTeams.map((team) => (
                                                    <option key={team.Team_Name} value={team.Team_Name}>
                                                        {team.Team_Name}
                                                    </option>
                                                ))}
                                            </select>

                                            {/* Tag Rescue Team Confirmation Button */}
                                            <button
                                                onClick={() => handleRescueTeamSelect(selectedRescueTeam)}
                                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                Confirm Tag
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HelpPosts;
