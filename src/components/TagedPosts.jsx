import React, { useEffect, useState } from 'react';
import {  useParams } from 'react-router-dom';
import service from '../appwrite/data_config';

function TagedPosts() {
    const { TeamsID } = useParams();
   const [myteamdata,setmyteamdata]=useState([]);
   const [tagedposts,settagedposts]=useState([]);
   const [error,setError]=useState('');

   console.log(TeamsID);
    useEffect(() => {
        async function fetchMyTagedPosts() {
            try {
                const data = await service.getMyTeamdata(TeamsID);
                setmyteamdata(data);
                console.log(data) // Assuming data is an array of team IDs
            } catch (error) {
                console.error('Error fetching rescue team IDs:', error);
                setError('Failed to fetch rescue team IDs.');
            }
        }
        fetchMyTagedPosts();
    }, [TeamsID]);

    useEffect(() => {
        if (myteamdata.length > 0) {
            const fetchTeamTagedPosts = async () => {
                const teamsArray = await Promise.all(
                    myteamdata.map(async (team) => {
                        try {
                            const teamData = await service.getTagedPostsbyID(team.HelpPostsID);
                            return teamData; // Return the fetched team dataHelpPostsID
                        } catch (error) {
                            console.error('Error fetching rescue team data:', error);
                            setError('Failed to fetch rescue team data.');
                            return null;
                        }
                    })
                );
                settagedposts(teamsArray.filter(team => team !== null)); // Update state with array of teams, filtering out any null results
            };
            fetchTeamTagedPosts();
        }
    }, [myteamdata]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-2xl font-bold mb-6">Taged Posts</h1>
            {error && <p className="text-red-500">{error}</p>}

            {tagedposts.length === 0 ? (
                <p className="text-center">Loading help posts...</p>
            ) : (
                <div className="text-center grid grid-cols-1 lg:grid-cols-2 gap-4 mx-auto">
                    {tagedposts.map((post, index) => (
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
                                </div> 
                           ))}
                           </div>
            )}
        </div>
    )};

export default TagedPosts;
