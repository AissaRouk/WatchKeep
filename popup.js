async function loadVideos() {
    const { videos = [] } = await browser.storage.local.get("videos");

    const list = document.querySelector(".video-list");

    if (videos.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.classList.add("empty-state");

        const icon = document.createElement("div");
        icon.classList.add("empty-icon");
        icon.textContent = "▶";

        const title = document.createElement("h2");
        title.textContent = "No videos yet";

        const description = document.createElement("p");
        description.textContent =
            "Start watching something and Watchkeep will remember it.";

        emptyState.appendChild(icon);
        emptyState.appendChild(title);
        emptyState.appendChild(description);

        list.appendChild(emptyState);

        return;
    }

    videos.forEach((video) => {
        const videoElement = document.createElement("div");
        videoElement.classList.add("video-item");

        // Title
        const title = document.createElement("h2");
        title.classList.add("video-title");
        title.textContent = video.name;

        // Progress bar
        const progressContainer = document.createElement("div");
        progressContainer.classList.add("progress-container");

        const progressBar = document.createElement("div");
        progressBar.classList.add("progress");

        const progress = percentage(
            video.currentTime,
            video.duration
        );

        progressBar.style.width = `${progress}%`;

        progressContainer.appendChild(progressBar);

        // Video info
        const videoInfo = document.createElement("div");
        videoInfo.classList.add("video-info");

        const time = document.createElement("span");
        time.classList.add("time");

        time.textContent =
            `${secondsToTime(video.currentTime)} / ` +
            `${secondsToTime(video.duration)}`;

        // Resume button
        const resumeButton = document.createElement("a");
        resumeButton.classList.add("resume-button");
        resumeButton.href = video.id;
        resumeButton.target = "_blank";
        resumeButton.textContent = "▶ Resume";

        videoInfo.appendChild(time);
        videoInfo.appendChild(resumeButton);

        // Assemble video item
        videoElement.appendChild(title);
        videoElement.appendChild(progressContainer);
        videoElement.appendChild(videoInfo);

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