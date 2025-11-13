// --- INTERACTIVE SLIDESHOW LOGIC ---

// Configuration
const rotationSpeed = 3000; // 3 seconds

// 1. Load Ad Paths from the hidden HTML list (Reading paths is robust)
const adDataContainer = document.getElementById('ad-data');
const ads = Array.from(adDataContainer.querySelectorAll('img')).map(img => img.getAttribute('src'));

// State and DOM Variables
let currentAdIndex = 0;
let intervalId = null;
let isPlaying = true;
let startX = 0; // For drag/swipe detection

const imageElement = document.getElementById('rotating-image');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const pauseButton = document.getElementById('pause-button');
const slideshowContainer = document.getElementById('slideshow-container');


// --- CORE FUNCTIONS ---

// Updates the image source based on the index
function showAd(index) {
    // Correctly wraps the index (handles negative numbers too)
    currentAdIndex = (index % ads.length + ads.length) % ads.length;
    
    const nextAdPath = ads[currentAdIndex];
    imageElement.src = nextAdPath; 
}

// Starts the automatic 3-second rotation
function startRotation() {
    if (intervalId !== null) return;
    isPlaying = true;
    pauseButton.textContent = '⏸'; 
    
    intervalId = setInterval(() => {
        showAd(currentAdIndex + 1);
    }, rotationSpeed);
}

// Stops the automatic rotation
function stopRotation() {
    if (intervalId === null) return;
    isPlaying = false;
    pauseButton.textContent = '▶'; 
    clearInterval(intervalId);
    intervalId = null;
}


// --- INTERACTION HANDLERS ---

function togglePlayPause() {
    if (isPlaying) {
        stopRotation();
    } else {
        startRotation();
    }
}

function navigate(direction) {
    stopRotation(); 
    showAd(currentAdIndex + direction);
}

// Swipe/Touch Detection for phones
slideshowContainer.addEventListener('touchstart', (e) => {
    stopRotation();
    // Record the X position of the first finger touch
    startX = e.touches[0].clientX;
});
slideshowContainer.addEventListener('touchend', (e) => {
    // Record the X position when the finger is lifted
    handleSwipe(e.changedTouches[0].clientX); 
});

function handleSwipe(endX) {
    const swipeDistance = endX - startX;
    const threshold = 50; // Distance needed to register a swipe

    if (swipeDistance > threshold) {
        navigate(-1); // Swiped Right -> Previous Ad
    } else if (swipeDistance < -threshold) {
        navigate(1); // Swiped Left -> Next Ad
    }
    // You could call startRotation() here if you wanted the timer to resume after a swipe.
}


// --- INITIALIZATION ---

// Attach event listeners to all buttons
pauseButton.addEventListener('click', togglePlayPause);
prevButton.addEventListener('click', () => navigate(-1));
nextButton.addEventListener('click', () => navigate(1));

// Start the automatic rotation when the page loads
startRotation();
