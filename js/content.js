function checkStatus() {
    return new Promise((resolve) => {
        chrome.storage.sync.get('youtubeFilterEnabled', (data) => {
            // Default to enabled if setting doesn't exist
            resolve(data.youtubeFilterEnabled !== false);
        });
    });
}

// Check if we're on a watch page
function isWatchPage() {
    return window.location.pathname === '/watch';
}

// Update classes based on page type and enabled status
async function updateFilters() {
    const enabled = await checkStatus();
    const onWatchPage = isWatchPage();

    // Add or remove enabled class
    if (enabled) {
        document.body.classList.add('youtube-filter-enabled');
        document.body.classList.remove('youtube-filter-disabled');
    } else {
        document.body.classList.add('youtube-filter-disabled');
        document.body.classList.remove('youtube-filter-enabled');
    }

    // Add or remove watch page class
    if (onWatchPage) {
        document.body.classList.add('on-watch-page');
    } else {
        document.body.classList.remove('on-watch-page');
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleFilter") {
        updateFilters();
        sendResponse({ status: "updated" });
    }
});

// Initialize when page loads
updateFilters();

// Update when URL changes (for single-page app navigation)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        updateFilters();
    }
}).observe(document, { subtree: true, childList: true });
