import {GoogleGenerativeAI}  from "@google/generative-ai";
import { YoutubeTranscript } from 'youtube-transcript';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to summarize the video
export const summarizeVideo = async (youtubeUrl) => {
    const videoId = extractVideoId(youtubeUrl); // Function to extract video ID
    const transcript = await fetchTranscript(videoId);

    const prompt = `Summarize the following transcript: ${transcript}`;
    const result = await model.generateContent(prompt);
    
    return result.response.text(); // Return the generated summary
};

// Fetch transcript using youtube-transcript
async function fetchTranscript(videoId) {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript.map(item => item.text).join(' '); // Join all text into a single string
}

// Extract video ID from a YouTube URL
function extractVideoId(youtubeUrl) {
    const urlParams = new URLSearchParams(new URL(youtubeUrl).search);
    return urlParams.get('v');
}
