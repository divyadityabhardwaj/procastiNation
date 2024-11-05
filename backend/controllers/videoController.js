import supabase from '../config/supabase.js';
import axios from 'axios';
import { summarizeVideo } from '../services/summarization.js';


export const createVideo = async (req, res) => {
    // Use req.query to get the sessionId and youtubeUrl from the query string
    const { sessionId, youtubeUrl } = req.query;

    // Check if both parameters are provided
    if (!sessionId || !youtubeUrl) {
        return res.status(400).json({ error: 'Session ID and YouTube URL are required.' });
    }

    try {
        if (youtubeUrl.includes('list=')) {
            // It's a playlist URL, handle the playlist
            const playlistId = youtubeUrl.split('list=')[1].split('&')[0];
            await handlePlaylist(sessionId, playlistId, res);
        } else if (youtubeUrl.includes('v=')) {
            // It's a single video URL, handle the video
            await handleSingleVideo(sessionId, youtubeUrl, res);
        } else {
            return res.status(400).json({ error: 'Invalid YouTube URL format.' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getSessionVideos = async (req, res) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('session_id', sessionId);

        if (error) {
            console.error('Error fetching session videos:', error);
            return res.status(400).json({ error: error.message });
        }

        if (data.length === 0) {
            return res.status(404).json({ message: 'No videos found for this session.' });
        }

        res.status(200).json({ videos: data });
    } catch (err) {
        console.error('Error fetching session videos:', err);
        res.status(500).json({ error: 'An error occurred while fetching the session videos.' });
    }
};

// Handle a single video
async function handleSingleVideo(sessionId, youtubeUrl, res) {
    try {
        const videoTitle = await getVideoTitleFromYouTube(youtubeUrl);

        // Insert the new video into the videos table
        const { data, error } = await supabase
            .from('videos')
            .insert([{ 
                session_id: sessionId, 
                youtube_url: youtubeUrl, 
                title: videoTitle, 
                notes: '',  
            }])
            .select('*');

        if (error) {
            console.error('Error creating video:', error);
            return res.status(400).json({ error: error.message });
        }

        // Return the created video
        res.status(201).json({ message: 'Video created successfully', video: data[0] });
    } catch (err) {
        console.error('Error handling single video:', err);
        res.status(500).json({ error: 'An error occurred while creating the video.' });
    }
}

// Handle playlist, including pagination
async function handlePlaylist(sessionId, playlistId, res) {
    try {
        const apiKey = process.env.YOUTUBE_API_KEY;
        let nextPageToken = '';
        let videosAdded = 0;

        do {
            const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?playlistId=${playlistId}&key=${apiKey}&part=snippet,contentDetails&maxResults=50&pageToken=${nextPageToken}`;
            const response = await axios.get(apiUrl);
            const videos = response.data.items;

            if (!videos || videos.length === 0) {
                return res.status(400).json({ error: 'No videos found in the playlist.' });
            }

            // Loop through each video in the playlist
            for (const video of videos) {
                const videoUrl = `https://www.youtube.com/watch?v=${video.contentDetails.videoId}`;
                const videoTitle = video.snippet.title;

                // Insert each video into the videos table
                const { error } = await supabase
                    .from('videos')
                    .insert([{ 
                        session_id: sessionId, 
                        youtube_url: videoUrl, 
                        title: videoTitle, 
                        notes: '',  
                        video_length: lengthInSeconds 
                    }]);

                if (error) {
                    console.error(`Error creating video for videoId ${video.contentDetails.videoId}:`, error);
                } else {
                    videosAdded++;
                }
            }

            nextPageToken = response.data.nextPageToken; // Move to the next page if there are more videos
        } while (nextPageToken);

        // Return success message
        res.status(201).json({ message: `${videosAdded} playlist videos created successfully` });
    } catch (err) {
        console.error('Error handling playlist:', err);
        res.status(500).json({ error: 'An error occurred while processing the playlist.' });
    }
}

// Function to retrieve video title from YouTube API
async function getVideoTitleFromYouTube(youtubeUrl) {
    const videoId = extractVideoId(youtubeUrl); // Extract video ID
    const apiKey = process.env.YOUTUBE_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    const response = await axios.get(apiUrl);
    if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found or inaccessible.');
    }
    const title = response.data.items[0].snippet.title; // Extract title from response
    return title;
}


export const summarizeVideoHandler = async (req, res) => {
    const { youtubeUrl } = req.query;

    if (!youtubeUrl) {
        return res.status(400).json({ error: 'YouTube URL is required.' });
    }

    try {
        const summary = await summarizeVideo(youtubeUrl);
        res.status(200).json({ summary });
    } catch (err) {
        console.error('Error summarizing video:', err);
        res.status(500).json({ error: 'An error occurred while summarizing the video.' });
    }
};

// Extract video ID from a YouTube URL
function extractVideoId(youtubeUrl) {
    return youtubeUrl.split('v=')[1].split('&')[0];
}


export const postVideoNotes = async (req, res) => {
    const { videoId } = req.params;  // Video ID passed as a parameter
    const { notes } = req.body;  // Notes sent in the request body

    // Check if both video ID and notes are provided
    if (!videoId || notes === undefined) {
        return res.status(400).json({ error: 'Video ID and notes are required.' });
    }

    try {
        const { data, error } = await supabase
            .from('videos')
            .update({ notes })
            .eq('id', videoId)
            .select('*');  // Optional: Returns the updated video

        if (error) {
            console.error('Error updating video notes:', error);
            return res.status(400).json({ error: error.message });
        }

        // Return the updated video data
        res.status(200).json({ message: 'Notes updated successfully', video: data[0] });
    } catch (err) {
        console.error('Error updating video notes:', err);
        res.status(500).json({ error: 'An error occurred while updating video notes.' });
    }
};

// GET: Retrieve notes for a specific video
export const getVideoNotes = async (req, res) => {
    const { videoId } = req.params;  // Video ID passed as a parameter

    if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required.' });
    }

    try {
        const { data, error } = await supabase
            .from('videos')
            .select('notes')
            .eq('id', videoId)
            .single();  // Expect a single result for a unique video ID

        if (error) {
            console.error('Error retrieving video notes:', error);
            return res.status(400).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ message: 'Notes not found for this video.' });
        }

        res.status(200).json({ notes: data.notes });
    } catch (err) {
        console.error('Error retrieving video notes:', err);
        res.status(500).json({ error: 'An error occurred while retrieving video notes.' });
    }
};