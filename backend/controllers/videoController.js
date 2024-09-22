import supabase from '../config/supabase.js';
import axios from 'axios';

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

// Handle a single video
async function handleSingleVideo(sessionId, youtubeUrl, res) {
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
                const videoLength = await getVideoLengthFromYoutube(videoUrl);
                const lengthInSeconds = iso8601ToSeconds(videoLength);

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

// Function to retrieve video length from YouTube API
async function getVideoLengthFromYoutube(youtubeUrl) {
    const videoId = extractVideoId(youtubeUrl); // Extract video ID
    const apiKey = process.env.YOUTUBE_API_KEY;
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${apiKey}&part=contentDetails`;

    const response = await axios.get(apiUrl);
    if (!response.data.items || response.data.items.length === 0) {
        throw new Error('Video not found or inaccessible.');
    }
    const length = response.data.items[0].contentDetails.duration; // Extract length from response
    return length;
}

// Extract video ID from a YouTube URL
function extractVideoId(youtubeUrl) {
    return youtubeUrl.split('v=')[1].split('&')[0];
}

// Function to convert ISO 8601 duration to seconds
function iso8601ToSeconds(isoDuration) {
    const matches = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    const hours = matches[1] ? parseInt(matches[1]) : 0;
    const minutes = matches[2] ? parseInt(matches[2]) : 0;
    const seconds = matches[3] ? parseInt(matches[3]) : 0;
    return hours * 3600 + minutes * 60 + seconds;
}
