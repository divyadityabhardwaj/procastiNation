'use client'
import { useState, useEffect } from 'react';

export default function SessionsPage() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSessionName, setNewSessionName] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the user's sessions from the backend
        const fetchSessions = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/sessions/sessions', {
                    method: 'GET',
                    credentials: 'include', // Include credentials (cookies) in the request
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setSessions(data.sessions || []);
            } catch (error) {
                console.error('Error fetching sessions:', error);
                setError('Failed to fetch sessions');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleCreateSession = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/sessions/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newSessionName }),
                credentials: 'include', // Include credentials (cookies) in the request
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSessions([...sessions, data.session]);
            setNewSessionName('');
        } catch (error) {
            console.error('Error creating session:', error);
            setError('Failed to create session');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Your Sessions</h2>
                {error && <div className="text-red-500 mb-4">{error}</div>}
                <ul>
                    {Array.isArray(sessions) && sessions.map((session) => (
                        <li key={session.id} className="mb-4">
                            <div className="p-4 bg-gray-200 rounded">
                                <h3 className="text-lg font-bold">{session.name}</h3>
                                <p>Created at: {new Date(session.created_at).toLocaleString()}</p>
                            </div>
                        </li>
                    ))}
                </ul>
                <form onSubmit={handleCreateSession} className="mt-4">
                    <input
                        type="text"
                        value={newSessionName}
                        onChange={(e) => setNewSessionName(e.target.value)}
                        placeholder="Session Name"
                        className="border p-2 rounded w-full mb-2"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    >
                        Create New Session
                    </button>
                </form>
            </div>
        </div>
    );
}