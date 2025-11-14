    <script>
        const adContainer = document.getElementById('ad-data');
        const adElements = Array.from(adContainer.children); // Gets all ad elements (the divs)
        const rotatingImage = document.getElementById('rotating-image');

        let currentAdIndex = 0;
        const adInterval = 5000; // 5 seconds automatic rotation
        let timer; // Variable to hold the interval timer

        // --- Core Functions ---

        function updateAd() {
            if (adElements.length === 0) {
                // Set a placeholder if no ads are found
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
            
            // Restart the timer
            timer = setInterval(rotateAd, adInterval); 
        }

        // --- Hot Link Click Handler ---
        rotatingImage.addEventListener('click', () => {
            const currentAdData = adElements[currentAdIndex];
            const link = currentAdData.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank'); // Opens link in a new tab/window
            }
        });

        // --- Initialization ---
        // 1. Load the first ad
        updateAd(); 
        // 2. Start the automatic rotation timer
        timer = setInterval(rotateAd, adInterval);
    </script>

