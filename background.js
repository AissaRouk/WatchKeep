console.log("🧠 Watchkeep background started!");

// Keep sets in memory for ultra-fast O(1) checking
let blacklistedSet = new Set();
let whitelistedSet = new Set();

// Load domains into memory on startup
const loadDomains = async () => {
    const result = await browser.storage.local.get(["blacklistedDomains", "whitelistedDomains"]);
    blacklistedSet = new Set(result.blacklistedDomains || []);
    whitelistedSet = new Set(result.whitelistedDomains || []);
};

// Initialize memory cache
loadDomains();

browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log("📨 Message received:", message);

    if (message.type === "VIDEO_PROGRESS") {
        const result = await browser.storage.local.get(VIDEOS);
        const videos = result.videos || [];
        const existingVideo = videos.find((video) => video.id === message.id);
        if (existingVideo) {
            existingVideo.currentTime = message.currentTime;
            existingVideo.duration = message.duration;
        } else {
            videos.push({
                id: message.id,
                name: message.name,
                currentTime: message.currentTime,
                duration: message.duration
            });
        }
        await browser.storage.local.set({ videos });
    }

    if (message.type === "GET_VIDEO_PROGRESS") {
        const result = await browser.storage.local.get(VIDEOS);
        const videos = result.videos || [];
        const video = videos.find((video) => video.id === message.id);
        console.log("📤 Sending progress back:", video);
        browser.tabs.sendMessage(sender.tab.id, {
            type: "VIDEO_PROGRESS_LOADED",
            progress: video
        });
    }

    if (message.type === CHECK_DOMAIN) {
        const domain = message.domain;
        if (blacklistedSet.has(domain)) return { isAllowed: false, unknown: false };
        if (whitelistedSet.has(domain)) return { isAllowed: true, unknown: false };
        return { isAllowed: false, unknown: true };
    }
});

browser.storage.local.get("videoProgress").then((result) => {
    console.log("💾 Stored progress:", result);
});