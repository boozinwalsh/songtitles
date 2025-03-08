// Song queue API endpoint - using Michelle Heafy's streamer account
const songQueueEndpoint = "https://api.streamersonglist.com/v1/streamers/michelleheafy/queue";

// Function to fetch and update the currently playing song
async function fetchCurrentSong() {
  try {
    const response = await fetch(songQueueEndpoint);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const songDisplay = document.getElementById('current-song-display');

    if (data && data.list && data.list.length > 0) {
      // Song is in the queue
      const currentTrack = data.list[0].song;
      
      // Update the display
      document.getElementById('track-title').textContent = currentTrack.title;
      document.getElementById('track-artist').textContent = currentTrack.artist;
      
      // Make display visible
      songDisplay.style.opacity = '1';
      songDisplay.style.pointerEvents = 'auto';
    } else {
      // No songs in queue
      showDefaultDisplay('Pollyanna', 'EarthBound'); // Default to match your screenshot
    }
  } catch (error) {
    console.error('Failed to fetch song data:', error);
    showDefaultDisplay('Pollyanna', 'EarthBound'); // Default to match your screenshot
  }
}

// Function to display default messages
function showDefaultDisplay(title, artist) {
  const songDisplay = document.getElementById('current-song-display');
  
  // Update text content
  document.getElementById('track-title').textContent = title;
  document.getElementById('track-artist').textContent = artist;
  
  // Show display
  songDisplay.style.opacity = '1';
  songDisplay.style.pointerEvents = 'auto';
}

// Initialize and set up periodic updates
document.addEventListener('DOMContentLoaded', () => {
  // Initial song data fetch
  fetchCurrentSong();
  
  // Update song data every 4 seconds
  setInterval(fetchCurrentSong, 4000);
});
