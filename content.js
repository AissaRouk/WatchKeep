console.log("🔥 Watchkeep loaded!");

const currentUrl = window.location.href;
const baseUrl = new URL(currentUrl).hostname;
let video;

// 1. Ask the background script if this domain is whitelisted
browser.runtime.sendMessage({ type: "CHECK_DOMAIN", domain: baseUrl }, (response) => {
    // If the domain is not whitelisted, stop here for now
    if (!response || !response.isAllowed) {
        console.log(`⏸️ Watchkeep paused: ${baseUrl} is not whitelisted.`);
        return;
    }

    console.log("🎬 Domain whitelisted, scanning for videos in " + baseUrl);

    const videos = document.querySelectorAll("video");
    let lastSavedTime = 0;
    const THRESHOLD_SECONDS = 15 * 60; // 15 minutes

    video = videos.length > 0 ? Array.from(videos).find(v => v.duration > THRESHOLD_SECONDS) : null;

    if (video) {
        video.addEventListener("timeupdate", () => {
            if (video.currentTime - lastSavedTime >= 2) {
                lastSavedTime = video.currentTime;
                saveProgress();
            }
        });

        video.addEventListener("pause", () => {
            saveProgress();
        });

        // Ask the background for previously saved progress
        browser.runtime.sendMessage({
            type: "GET_VIDEO_PROGRESS",
            id: window.location.href
        });
    }
});

// Listen for the response from background
browser.runtime.onMessage.addListener((message) => {
    console.log("📩 Message from background:", message);

    if (message.type === "VIDEO_PROGRESS_LOADED") {
        const progress = message.progress;

        if (progress && video) {
            console.log(`⏩ Resuming from ${progress.currentTime}s`);
            video.currentTime = progress.currentTime;
        }
    }
});

// Functions
const saveProgress = () => {
    console.log(`⏱️ ${Math.floor(video.currentTime)}s / ${Math.floor(video.duration)}s`);

    browser.runtime.sendMessage({
        type: VIDEO_PROGRESS,
        id: window.location.href,
        name: document.title,
        currentTime: video.currentTime,
        duration: video.duration
    });
};