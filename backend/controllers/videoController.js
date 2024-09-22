import supabase from '../config/supabase.js';
import axios from 'axios';

export const createVideo = async (req, res) => {
    const { sessionId, youtubeUrl } = req.params;

    // Check if both parameters are provided
    if (!sessionId || !youtubeUrl) {
        return res.status(400).json({ error: 'Session ID and YouTube URL are required.' });
    }

    try {
        const videoTitle = await getVideoTitleFromYouTube(youtubeUrl);
        const videoLength = await getVideoLengthFromYoutube(youtubeUrl);
        const lengthInSeconds = iso8601ToSeconds(videoLength); // Convert ISO 8601 format to seconds

        // Insert the new video into the videos table
        const { data, error } = await supabase
            .from('videos')
            .insert([{ 
                session_id: sessionId, 
                youtube_url: youtubeUrl, 
                title: videoTitle, 
                notes: '',  
                video_length: lengthInSeconds 
            }])
            .select('*');

        console.log(data)
        console.log(error)

        // Check for errors during insertion
        if (error) {
            console.error('Error creating video:', error);
            return res.status(400).json({ error: error.message });
        }



        // Check if data was returned
        if (!data || data.length === 0) {
            return res.status(500).json({ error: 'Video could not be created.' });
        }

        // Return the created video
        res.status(201).json({ message: 'Video created successfully', video: data[0] });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
};

// Function to retrieve video title from YouTube API
async function getVideoTitleFromYouTube(youtubeUrl) {
    const videoId = youtubeUrl.split('v=')[1].split('&')[0]; // Extract video ID from URL
    const apiKey = process.env.YOUTUBE_API_KEY; // Your YouTube API key
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=snippet`;

    const response = await axios.get(apiUrl);
    if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found or inaccessible.');
    }
    const title = response.data.items[0].snippet.title; // Extract title from response
    return title;
}

// Function to retrieve video length from YouTube API
async function getVideoLengthFromYoutube(youtubeUrl) {
    const videoId = youtubeUrl.split('v=')[1].split('&')[0]; // Extract video ID from URL
    const apiKey = process.env.YOUTUBE_API_KEY; // Your YouTube API key
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;

    const response = await axios.get(apiUrl);
    if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found or inaccessible.');
    }
    const length = response.data.items[0].contentDetails.duration; // Extract length from response
    return length;
}

// Function to convert ISO 8601 duration to seconds
function iso8601ToSeconds(isoDuration) {
    const matches = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
}
