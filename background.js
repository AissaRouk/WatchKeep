console.log("🧠 Watchkeep background started!");

browser.runtime.onMessage.addListener(async (message, sender) => {
    console.log("📨 Message received:", message);

    if (message.type === "VIDEO_PROGRESS") {
        const result = await browser.storage.local.get("videos");

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
        const result = await browser.storage.local.get(`videos`);

        const videos = result.videos || [];

        const video = videos.find((video) => video.id === message.id);

        console.log("📤 Sending progress back:", video);

        browser.tabs.sendMessage(sender.tab.id, {
            type: "VIDEO_PROGRESS_LOADED",
            progress: video
        });
    }
});

browser.storage.local.get("videoProgress").then((result) => {
    console.log("💾 Stored progress:", result);
});