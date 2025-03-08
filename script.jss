// API endpoint for retrieving song data
const API_URL = "https://workers-playground-gentle-heart-f97b.boozinwalsh.workers.dev//?url=https://api.streamersonglist.com/v1/streamers/michelleheafy/queue";

/**
 * Adjusts the font size of the song title so that it fits within its container.
 */
function adjustSongTitleFont() {
  const titleEl = document.getElementById('song-title');
  const wrapper = document.getElementById('title-wrapper');

  // Retrieve max and min font sizes from CSS variables
  let maxFontSize = parseInt(getComputedStyle(document.documentElement)
                            .getPropertyValue('--title-max-font-size'));
  let minFontSize = parseInt(getComputedStyle(document.documentElement)
                            .getPropertyValue('--title-min-font-size'));

  // Start at maximum size
  titleEl.style.fontSize = `${maxFontSize}px`;
  let currentFontSize = maxFontSize;

  // Reduce the font size until the text fits inside the wrapper or reaches the minimum size
  while ((titleEl.scrollWidth > wrapper.clientWidth ||
          titleEl.scrollHeight > wrapper.clientHeight) &&
         currentFontSize > minFontSize) {
    currentFontSize--;
    titleEl.style.fontSize = `${currentFontSize}px`;
  }

  // If the font size is below the minimum, force it and handle overflow
  if (currentFontSize < minFontSize) {
    titleEl.style.fontSize = `${minFontSize}px`;
    titleEl.style.textOverflow = 'ellipsis';
  }
}

/**
 * Fetches the current song data from the API and updates the display.
 */
async function fetchSongData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();

    // Check if there's at least one song in the queue
    if (data && data.list && data.list.length > 0) {
      const nowPlaying = data.list.find(song => song.position === 1);
      document.getElementById('song-title').textContent = song.title;
      document.getElementById('artist-name').textContent = song.artist;

      adjustSongTitleFont();
      // Ensure the display is active
      const container = document.getElementById('display-container');
      container.style.opacity = '1';
      container.style.pointerEvents = 'auto';
    } else {
      // When no song is playing
      updateDisplay("No song playing", "");
    }
  } catch (error) {
    console.error("Error fetching song data:", error);
    updateDisplay("Error fetching song data", "");
  }
}

/**
 * Updates the display with a default message and toggles visibility.
 */
function updateDisplay(title, artist) {
  const container = document.getElementById('display-container');
  if (title === "No song playing") {
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
  } else {
    container.style.opacity = '1';
    container.style.pointerEvents = 'auto';
  }
  document.getElementById('song-title').textContent = title;
  document.getElementById('artist-name').textContent = artist;
  adjustSongTitleFont();
}

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  fetchSongData();              // Initial fetch
  setInterval(fetchSongData, 4000); // Refresh data every 4 seconds
});
