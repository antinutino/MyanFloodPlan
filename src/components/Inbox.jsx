import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import service from '../appwrite/data_config'; // Assuming your service is properly configured
import { AuthContext } from './Authprovider';

function Inbox() {
    const { TeamsID } = useParams();
    const { user } = useContext(AuthContext);
    
    const [inboxdata, setinboxdata] = useState([]);
    const [newMessage, setNewMessage] = useState(''); // State to hold the new message
    const [error, setError] = useState('');
    
    const [currentPage, setCurrentPage] = useState(); // State to manage current page
    const [messagesPerPage] = useState(10); // Number of messages to display per page

    // Fetch existing inbox messages when component loads
    useEffect(() => {
        async function fetchInboxMessages() {
            try {
                const data = await service.getMyTeamdata(TeamsID); // Fetch messages based on team ID
                setinboxdata(data);
                setCurrentPage(data.length/10);
                console.log(data); // Assuming data is an array of inbox messages
            } catch (error) {
                console.error('Error fetching inbox data:', error);
                setError('Failed to fetch inbox data.');
            }
        }
        if (TeamsID) {
            fetchInboxMessages();
        }
    }, [TeamsID]);

    // Function to handle new message submission
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage) {
            alert("Please enter a message before sending.");
            return;
        }

        try {
            // Send the new message to the server
            const messageData = {
                RescueTeamID: TeamsID,
                SenderName: user.name,
                Message: newMessage,
            };
            await service.sendMessageToInbox(messageData); // Assuming this is the API to send messages

            // Update the inbox data to include the new message
            setinboxdata([messageData, ...inboxdata]);

            // Clear the message input field after sending
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send the message.');
        }
    };

    // Function to load previous messages
    const loadMoreMessages = () => {
        setCurrentPage(currentPage>1?currentPage-1:0); // Increase the current page number
    };
    const loadnextmessages = () => {
        setCurrentPage(currentPage<(inboxdata.length/10)?currentPage+1:(inboxdata.length/10)); // Increase the current page number
    };

    // Calculate the messages to display based on the current page
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = inboxdata.slice(indexOfFirstMessage, indexOfLastMessage);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Inbox</h1>
            {error && <p className="text-red-500">{error}</p>}

            {/* Display previous inbox messages */}
            <div className="mb-6">
                {currentMessages.length === 0 ? (
                    <p className="text-gray-500">No messages yet.</p>
                ) : (
                    <div className="space-y-4">
                        {currentMessages.map((msg, index) => (
                            <div
                                key={index}
                                className="p-4 border rounded-lg shadow-md bg-gray-50"
                            >
                                <p className="text-sm text-gray-500">
                                    <strong>{msg.SenderName}</strong> -{' '}
                                    {new Date(msg.$createdAt).toLocaleString()}
                                </p>
                                <p className="text-gray-800">{msg.Message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Button to load more messages */}
            {inboxdata.length > currentMessages.length && (
              <div className='flex flex-row space-x-4 mb-4 justify-end'>
                <button
                    onClick={loadMoreMessages}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Load Previous Messages
                </button>
                <button
                    onClick={loadnextmessages}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                >
                    Load Next Messages
                </button>
                </div>
            )}

            {/* Message input form */}
            <form onSubmit={handleSendMessage} className="flex flex-col space-y-4">
                <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                    rows="3"
                />

                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
}

export default Inbox;
