    <script>
        const adContainer = document.getElementById('ad-data');
        const adElements = Array.from(adContainer.children);
        const slideshowContainer = document.getElementById('slideshow-container');
        const rotatingImage = document.getElementById('rotating-image');
        const pauseButton = document.getElementById('pause-button'); // Reference the new button

        let currentAdIndex = 0;
        const adInterval = 3000;
        let timer; 
        let isPaused = false; // NEW STATE FLAG
        
        // --- FINAL PATH FIX ---
        const basePath = window.location.pathname.replace('index.html', '');

        // SWIPE GESTURE VARIABLES
        let touchstartX = 0;
        let touchendX = 0;
        let isSwiping = false; 

        // --- Pause Functionality ---

        function togglePause() {
            if (isPaused) {
                // Resume rotation (Play)
                timer = setInterval(rotateAd, adInterval);
                pauseButton.innerHTML = '&#9208;'; // Change symbol to PAUSE
                isPaused = false;
            } else {
                // Stop rotation (Pause)
                clearInterval(timer);
                pauseButton.innerHTML = '&#9654;'; // Change symbol to PLAY
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
            
            rotatingImage.src = basePath + relativePath.substring(1); 
        }

        function rotateAd() {
            currentAdIndex = (currentAdIndex + 1) % adElements.length;
            updateAd();
        }

        function changeAd(direction) {
            // Stop rotation, but ONLY restart if we aren't currently paused by the user
            clearInterval(timer); 

            let newIndex = currentAdIndex + direction;
            if (newIndex < 0) {
                newIndex = adElements.length - 1;
            } else if (newIndex >= adElements.length) {
                newIndex = 0;
            }
            currentAdIndex = newIndex;
            updateAd();
            
            // Only restart the timer if the user has NOT explicitly paused it
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
        // (Swiping also calls changeAd, which respects the isPaused flag)

        function handleGesture() {
            const swipeThreshold = 50; 
            const swipeDistance = touchendX - touchstartX;
            
            if (Math.abs(swipeDistance) < swipeThreshold) {
                 isSwiping = false;
                 return;
            }

            isSwiping = true;

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

