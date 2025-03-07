document.addEventListener('DOMContentLoaded', function () {
    const toggleSwitch = document.getElementById('filterToggle');

    // Get current state
    chrome.storage.sync.get('youtubeFilterEnabled', function (data) {
        // Default to enabled if setting doesn't exist
        toggleSwitch.checked = data.youtubeFilterEnabled !== false;
    });

    // Handle toggle changes
    toggleSwitch.addEventListener('change', function () {
        const enabled = this.checked;

        // Save setting
        chrome.storage.sync.set({ 'youtubeFilterEnabled': enabled });

        // Send message to content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            if (tabs[0].url.includes('youtube.com')) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "toggleFilter" });
            }
        });
    });
});