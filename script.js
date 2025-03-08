// API URL
const apiUrl = "https://api.streamersonglist.com/v1/streamers/michelleheafy/queue";

// Function to adjust the font size of the song title to fit the bounding box
function adjustTitleFontSize() {
  const titleElement = document.getElementById('song-title');
  const container = document.getElementById('song-title-container');

  // Retrieve maximum and minimum font sizes from CSS variables
  let maxFontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--title-max-font-size'));
  let minFontSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--title-min-font-size'));
  
  // Set the initial font size to maxFontSize
  titleElement.style.fontSize = `${maxFontSize}px`;

  // Measure the required size
  let currentFontSize = maxFontSize;

  // Reduce font size until the title fits within the container or reaches the minimum font size
  while ((titleElement.scrollWidth > container.clientWidth || titleElement.scrollHeight > container.clientHeight) && currentFontSize > minFontSize) {
    currentFontSize -= 1;
    titleElement.style.fontSize = `${currentFontSize}px`;
  }

  // Optionally, prevent the title from becoming too small
  if (currentFontSize < minFontSize) {
    titleElement.style.fontSize = `${minFontSize}px`;
    titleElement.style.textOverflow = 'ellipsis'; // Ensure overflow is handled
  }
}

// Function to update song data from the API
async function updateSongData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (data && data.list && data.list.length > 0) {
      const currentSong = data.list[0].song;

      // Update visible display
      document.getElementById('song-title').textContent = currentSong.title;
      document.getElementById('artist-name').textContent = currentSong.artist;

      // Adjust the font size to fit the bounding box
      adjustTitleFontSize();

      // Make the display visible
      const songDisplay = document.getElementById('song-display');
      songDisplay.style.opacity = '1';
      songDisplay.style.pointerEvents = 'auto';
    } else {
      // No song playing
      setDefaultDisplay('No song playing', '');
    }
  } catch (error) {
    console.error('Error fetching song data:', error);
    // Display an error message to the user
    setDefaultDisplay('Error fetching song data', '');
  }
}

// Function to set default display messages and hide the display
function setDefaultDisplay(title, artist) {
  const songDisplay = document.getElementById('song-display');

  if (title === 'No song playing') {
    // Hide the display
    songDisplay.style.opacity = '0';          // Make it invisible
    songDisplay.style.pointerEvents = 'none'; // Disable interactions
  } else {
    // Show the display
    songDisplay.style.opacity = '1';          // Make it visible
    songDisplay.style.pointerEvents = 'auto'; // Enable interactions
  }

  // Update visible display
  document.getElementById('song-title').textContent = title;
  document.getElementById('artist-name').textContent = artist;

  // Adjust the font size to fit the bounding box
  adjustTitleFontSize();
}

// Initialize functions on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  updateSongData();                    // Initial data fetch
  setInterval(updateSongData, 4000);   // Update data every 4 seconds
});