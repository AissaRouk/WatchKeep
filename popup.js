async function loadVideos() {
    const { videos = [] } = await browser.storage.local.get("videos");

    const list = document.querySelector(".video-list");

    if (videos.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">▶</div>
                <h2>No videos yet</h2>
                <p>Start watching something and Watchkeep will remember it.</p>
            </div>
        `;

        return;
    }

    videos.forEach((video) => {
        const videoElement = document.createElement("div");

        videoElement.classList.add("video-item");

        const progress = percentage(
            video.currentTime,
            video.duration
        );

        videoElement.innerHTML = `
            <h2 class="video-title">${video.name}</h2>

            <div class="progress-container">
                <div
                    class="progress"
                    style="width: ${progress}%"
                ></div>
            </div>

            <div class="video-info">

                <span class="time">
                    ${secondsToTime(video.currentTime)}
                    /
                    ${secondsToTime(video.duration)}
                </span>

                <a
                    class="resume-button"
                    href="${video.id}"
                    target="_blank"
                >
                    ▶ Resume
                </a>

            </div>
        `;

        list.appendChild(videoElement);
    });
}


const percentage = (current, total) => {
    return !total ? 0 : (current / total) * 100;
};


const secondsToTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${h
        ? h.toString().padStart(2, "0")
        : ""
        }${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
};


loadVideos();