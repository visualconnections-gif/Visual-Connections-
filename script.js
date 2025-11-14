    <script>
        const adContainer = document.getElementById('ad-data');
        const adElements = Array.from(adContainer.children); // Gets all ad elements (the divs)
        const rotatingImage = document.getElementById('rotating-image');

        let currentAdIndex = 0;
        const adInterval = 3000; // CHANGED: 3 seconds (3000 milliseconds) automatic rotation
        let timer; // Variable to hold the interval timer
        
        // SWIPE GESTURE VARIABLES
        let touchstartX = 0;
        let touchendX = 0;

        // --- Core Functions ---

        function updateAd() {
            if (adElements.length === 0) {
                rotatingImage.src = ''; 
                rotatingImage.alt = 'No Ads Found';
                return;
            }

            const currentAdData = adElements[currentAdIndex];
            
            // Set the image source using the 'data-file' attribute
            rotatingImage.src = currentAdData.getAttribute('data-file');
        }

        function rotateAd() {
            currentAdIndex = (currentAdIndex + 1) % adElements.length;
            updateAd();
        }

        function changeAd(direction) {
            // Clear the automatic rotation when user interacts
            clearInterval(timer);

            let newIndex = currentAdIndex + direction;
            if (newIndex < 0) {
                newIndex = adElements.length - 1;
            } else if (newIndex >= adElements.length) {
                newIndex = 0;
            }
            currentAdIndex = newIndex;
            updateAd();
            
            // Restart the timer with the new, faster interval
            timer = setInterval(rotateAd, adInterval); 
        }

        // --- Hot Link Click/Tap Handler ---
        rotatingImage.addEventListener('click', (event) => {
            // Check if the click/tap was part of a swipe (so we don't accidentally open links)
            if (Math.abs(touchstartX - touchendX) < 10 && event.detail !== 0) {
                const currentAdData = adElements[currentAdIndex];
                const link = currentAdData.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank'); // Opens link in a new tab/window
                }
            }
        });

        // --- SWIPE GESTURE LOGIC ---

        function handleGesture() {
            const swipeThreshold = 50; // Minimum distance to register as a swipe
            
            if (Math.abs(touchendX - touchstartX) < swipeThreshold) return;

            // Swipe Right (Goes to Previous Ad)
            if (touchendX < touchstartX) {
                changeAd(1); // Next Ad
            }
            
            // Swipe Left (Goes to Next Ad)
            if (touchendX > touchstartX) {
                changeAd(-1); // Previous Ad
            }
        }

        rotatingImage.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
            touchendX = e.changedTouches[0].screenX; // Initialize touchendX
        }, false);

        rotatingImage.addEventListener('touchmove', e => {
            // Update touchendX as the user swipes
            touchendX = e.changedTouches[0].screenX; 
        }, false);

        rotatingImage.addEventListener('touchend', e => {
            // Use the final touch position
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

