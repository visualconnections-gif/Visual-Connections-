    <script>
        const adContainer = document.getElementById('ad-data');
        const adElements = Array.from(adContainer.children); // Gets all ad elements (the divs)
        const slideshowContainer = document.getElementById('slideshow-container');
        const rotatingImage = document.getElementById('rotating-image');

        let currentAdIndex = 0;
        const adInterval = 3000; // 3 seconds automatic rotation
        let timer; 
        
        // SWIPE GESTURE VARIABLES
        let touchstartX = 0;
        let touchendX = 0;
        let isSwiping = false; // Flag to prevent link opening during a swipe

        // --- Core Functions ---

        function updateAd() {
            if (adElements.length === 0) {
                rotatingImage.src = ''; 
                rotatingImage.alt = 'No Ads Found. Check Ad Data.';
                return;
            }
            const currentAdData = adElements[currentAdIndex];
            rotatingImage.src = currentAdData.getAttribute('data-file');
        }

        function rotateAd() {
            currentAdIndex = (currentAdIndex + 1) % adElements.length;
            updateAd();
        }

        function changeAd(direction) {
            clearInterval(timer); // Clear auto-rotation
            
            let newIndex = currentAdIndex + direction;
            if (newIndex < 0) {
                newIndex = adElements.length - 1;
            } else if (newIndex >= adElements.length) {
                newIndex = 0;
            }
            currentAdIndex = newIndex;
            updateAd();
            
            // Restart the timer
            timer = setInterval(rotateAd, adInterval); 
        }

        // --- Hot Link Click/Tap Handler ---
        rotatingImage.addEventListener('click', () => {
            // Prevent link from opening if the user was actively swiping (distance > 10px)
            if (!isSwiping) { 
                const currentAdData = adElements[currentAdIndex];
                const link = currentAdData.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank'); // Opens link in a new tab/window
                }
            }
            isSwiping = false; // Reset the flag after potential click
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

            // Swipe Right motion (touch starts left, ends right) -> Go to PREVIOUS Ad (-1)
            if (swipeDistance > 0) {
                changeAd(-1); 
            }
            
            // Swipe Left motion (touch starts right, ends left) -> Go to NEXT Ad (+1)
            if (swipeDistance < 0) {
                changeAd(1); 
            }
        }

        slideshowContainer.addEventListener('touchstart', e => {
            touchstartX = e.changedTouches[0].screenX;
        }, false);

        slideshowContainer.addEventListener('touchmove', e => {
            // Update touchendX as the user swipes
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

