// Song queue API endpoint - using Michelle Heafy's streamer account
const songQueueEndpoint = "https://api.streamersonglist.com/v1/streamers/michelleheafy/queue";

// Function to dynamically resize the title text to fit its container
function resizeTitleText() {
  const titleElement = document.getElementById('track-title');
  const titleContainer = document.getElementById('track-title-wrapper');

  // Get font size constraints from CSS variables
  const maxSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--title-max-size'));
  const minSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--title-min-size'));
  
  // Start with maximum font size
  let fontSize = maxSize;
  titleElement.style.fontSize = `${fontSize}px`;

  // Decrease font size until text fits or minimum size is reached
  while ((titleElement.scrollWidth > titleContainer.clientWidth || 
         titleElement.scrollHeight > titleContainer.clientHeight) && 
         fontSize > minSize) {
    fontSize--;
    titleElement.style.fontSize = `${fontSize}px`;
  }

  // If text is still too large at minimum size, add ellipsis
  if (fontSize <= minSize) {
    titleElement.style.fontSize = `${minSize}px`;
    titleElement.style.textOverflow = 'ellipsis';
  }
}

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
      
      // Adjust title size
      resizeTitleText();
    } else {
      // No songs in queue
      showDefaultDisplay('No song playing', '');
    }
  } catch (error) {
    console.error('Failed to fetch song data:', error);
    showDefaultDisplay('Error loading song data', '');
  }
}

// Function to display default messages or hide the display
function showDefaultDisplay(title, artist) {
  const songDisplay = document.getElementById('current-song-display');
  
  // Update text content
  document.getElementById('track-title').textContent = title;
  document.getElementById('track-artist').textContent = artist;
  
  if (title === 'No song playing') {
    // Hide display when no song is playing
    songDisplay.style.opacity = '0';
    songDisplay.style.pointerEvents = 'none';
  } else {
    // Show display for error messages
    songDisplay.style.opacity = '1';
    songDisplay.style.pointerEvents = 'auto';
  }
  
  // Adjust title size for the default message
  resizeTitleText();
}

// Initialize and set up periodic updates
document.addEventListener('DOMContentLoaded', () => {
  // Initial song data fetch
  fetchCurrentSong();
  
  // Update song data every 4 seconds
  setInterval(fetchCurrentSong, 4000);
});