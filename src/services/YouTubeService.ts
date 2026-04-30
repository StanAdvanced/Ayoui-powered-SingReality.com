/// <reference types="vite/client" />
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

export async function searchVideos(query: string, maxResults = 5) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  if (!apiKey || apiKey === 'MY_YOUTUBE_API_KEY') {
    console.warn("YouTube API Key not configured.");
    return [];
  }

  try {
    const url = new URL(`${YOUTUBE_API_BASE}/search`);
    url.searchParams.append('part', 'snippet');
    url.searchParams.append('q', query);
    url.searchParams.append('maxResults', maxResults.toString());
    url.searchParams.append('type', 'video');
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
}

export async function getVideoDetails(videoId: string) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
  if (!apiKey) return null;

  try {
    const url = new URL(`${YOUTUBE_API_BASE}/videos`);
    url.searchParams.append('part', 'snippet,contentDetails,statistics');
    url.searchParams.append('id', videoId);
    url.searchParams.append('key', apiKey);

    const response = await fetch(url.toString());
    const data = await response.json();
    return data.items?.[0] || null;
  } catch (error) {
    console.error("Error fetching YouTube video details:", error);
    return null;
  }
}
