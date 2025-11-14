    <script>
        const adContainer = document.getElementById('ad-data');
        const adElements = Array.from(adContainer.children);
        const slideshowContainer = document.getElementById('slideshow-container');
        const rotatingImage = document.getElementById('rotating-image');
        const pauseButton = document.getElementById('pause-button');

        let currentAdIndex = 0;
        const adInterval = 3000; // 3 seconds automatic rotation
        let timer; 
        let isPaused = false;
        
        // --- FINAL PATH FIX: Explicit Repository Name ---
        // This is the most reliable way to fix the broken image issue on GitHub Pages
        // by explicitly using the repository name for the base path.
        const basePath = "/Visual-Connections-";

        // SWIPE GESTURE VARIABLES
        let touchstartX = 0;
        let touchendX = 0;
        let isSwiping = false; 

        // --- Pause Functionality ---

        function togglePause() {
            if (isPaused) {
                // Resume rotation (Play)
                timer = setInterval(rotateAd, adInterval);
                pauseButton.innerHTML = '&#9208;'; // PAUSE symbol
                isPaused = false;
            } else {
                // Stop rotation (Pause)
                clearInterval(timer);
                pauseButton.innerHTML = '&#9654;'; // PLAY symbol
                isPaused = true;
            }
        }

        // --- Core Functions ---

        function updateAd() {
            if (adElements.length === 0) {
                rotatingImage.src = ''; 
                rotatingImage.alt = 'No Ads Found. Check Ad Data.';
                return;
            }
            const currentAdData = adElements[currentAdIndex];
            const relativePath = currentAdData.getAttribute('data-file');
            
            // CONCATENATE: basePath + relativePath (stripping the leading / from the data-file)
            // Resulting URL structure: /Visual-Connections-/ads/Ad1.jpg
            rotatingImage.src = basePath + relativePath.substring(1); 
        }

        function rotateAd() {
            currentAdIndex = (currentAdIndex + 1) % adElements.length;
            updateAd();
        }

        function changeAd(direction) {
            clearInterval(timer); 

            let newIndex = currentAdIndex + direction;
            if (newIndex < 0) {
                newIndex = adElements.length - 1;
            } else if (newIndex >= adElements.length) {
                newIndex = 0;
            }
            currentAdIndex = newIndex;
            updateAd();
            
            // Only restart the timer if the user hasn't paused it
            if (!isPaused) {
                timer = setInterval(rotateAd, adInterval); 
            }
        }

        // --- Hot Link Click/Tap Handler ---
        rotatingImage.addEventListener('click', () => {
            if (!isSwiping) { 
                const currentAdData = adElements[currentAdIndex];
                const link = currentAdData.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank'); 
                }
            }
            isSwiping = false; 
        });

        // --- SWIPE GESTURE LOGIC ---

        function handleGesture() {
            const swipeThreshold = 50; 
            const swipeDistance = touchendX - touchstartX;
            
            if (Math.abs(swipeDistance) < swipeThreshold) {
                 isSwiping = false;
                 return;
            }

            isSwiping = true;

            // Swiping also calls changeAd, which respects the isPaused flag
            if (swipeDistance > 0) {
                changeAd(-1); // Swipe Right -> Previous Ad
            }
            
            if (swipeDistance < 0) {
                changeAd(1); // Swipe Left -> Next Ad
            }
        }

        slideshowContainer.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, false);

        slideshowContainer.addEventListener('touchmove', e => {
            touchendX = e.changedTouches[0].screenX; 
        }, false);

        slideshowContainer.addEventListener('touchend', e => {
            touchendX = e.changedTouches[0].screenX; 
            handleGesture();
        }, false);

        // --- Initialization ---
        window.onload = function() {
            if (adElements.length > 0) {
                updateAd(); 
                timer = setInterval(rotateAd, adInterval);
            }
        };
    </script>

