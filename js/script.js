// ========================================================
// 1. VIDEOS DATA VARIABLE
// ========================================================
const myVideos = [
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/05.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/Apna%20ghar.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/Classic%20650%20(Vallam%20Red)DharmeshKEdits.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/Dharmesh%20K%20Edits%20Video%20edit%20journey.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/FINAL_Edit%20by%20dharmesh.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/animation%20demo%20video.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/paro%20dharmeshkedits%2002.mp4",
    "https://github.com/Dharmesh800/01-Video/raw/refs/heads/main/yes_now_create_a_video_that_do.mp4"
];

// ==========================
// Header Load
// ==========================

fetch("components/header.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("header").innerHTML = data;

        // --- Mobile menu toggle (must run AFTER header is injected) ---
        const menuBtn = document.getElementById("menuBtn");
        const navContainer = document.getElementById("navContainer");

        if (menuBtn && navContainer) {
            menuBtn.addEventListener("click", () => {
                const isOpen = navContainer.classList.toggle("open");
                menuBtn.innerHTML = isOpen
                    ? '<i class="fa-solid fa-xmark"></i>'
                    : '<i class="fa-solid fa-bars"></i>';
            });

            navContainer.querySelectorAll(".nav-item").forEach(link => {
                link.addEventListener("click", () => {
                    navContainer.classList.remove("open");
                    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                });
            });
        } else {
            console.error("Menu button or nav container not found in header.html");
        }
    })
    .catch(err => console.error("Failed to load header:", err));

// ==========================
// contact Load
// ==========================
// fetch("components/contact.html")
//     .then(response => response.text())
//     .then(data => {
//         document.getElementById("contact").innerHTML = data;
//     });

// ==========================
// Footer Load
// ==========================
fetch("components/footer.html")
    .then(response => response.text())
    .then(data => {
        document.getElementById("footer").innerHTML = data;
    })
    .catch(err => console.error("Failed to load footer:", err));

// ==========================
// Page Loader
// ==========================
async function loadPage(page) {
    try {
        const response = await fetch(`pages/${page}.html`);

        if (!response.ok) {
            throw new Error(`Page "${page}" returned ${response.status}`);
        }

        const html = await response.text();
        document.getElementById("content").innerHTML = html;

        // Page Initializers
        switch (page) {
            case "home":
                if (typeof initGradients === "function") {
                    initGradients();
                }

                fetch("./pages/HomeVideoSection.html")
                    .then(response => response.text())
                    .then(data => {
                        document.getElementById("HomeVideoSection").innerHTML = data;
                        initializeVideoGrid(myVideos, 'videoGrid');
                    })
                    .catch(err => console.error("Failed to load video section:", err));
                break;

            case "gradients":
                if (typeof initGradients === "function") {
                    initGradients();
                }
                break;
        }

    } catch (error) {
        console.error(error);
        document.getElementById("content").innerHTML = "<h2>Page Not Found</h2>";
    }
}

// ==========================
// Router
// ==========================
function router() {
    let page = location.hash.replace("#/", "");

    if (page === "") {
        page = "home";
    }

    loadPage(page);
}

// ==========================
// Global Access
// ==========================
window.loadPage = loadPage;

// ==========================
// Route Events
// ==========================
window.addEventListener("hashchange", router);

// ==========================
// First Load
// ==========================
router();

// ========================================================
// 2. REUSABLE FUNCTION FOR VIDEO GRID (WITH LAZY READY-LOAD)
// ========================================================
function initializeVideoGrid(videoLinksArray, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) {
        console.error(`Container with ID "${containerId}" not found.`);
        return;
    }

    grid.innerHTML = '';

    videoLinksArray.forEach((link, index) => {
        const card = document.createElement("div");
        card.className = "video-card video-card-loading";
        card.dataset.index = index;

        const loader = document.createElement("div");
        loader.className = "video-loader";
        loader.innerHTML = `<div class="spinner"></div><span>Loading...</span>`;
        card.appendChild(loader);

        grid.appendChild(card);

        const video = document.createElement("video");
        video.src = link;
        video.controls = true;
        video.preload = "metadata";
        video.style.display = "none";

        video.setAttribute("controlsList", "nodownload noplaybackrate");
        video.setAttribute("disablePictureInPicture", "");
        video.addEventListener("contextmenu", e => e.preventDefault());

        video.addEventListener("play", function () {
            document.querySelectorAll("video").forEach(v => {
                if (v !== video) v.pause();
            });
        });

        video.addEventListener("canplay", function onReady() {
            video.removeEventListener("canplay", onReady);

            const watermark = document.createElement("div");
            watermark.className = "watermark";
            watermark.innerText = "DharmeshKEdits";

            card.innerHTML = "";
            video.style.display = "block";
            card.appendChild(video);
            card.appendChild(watermark);

            card.classList.remove("video-card-loading");
            card.classList.add("video-card-ready");
        }, { once: true });

        video.addEventListener("error", function () {
            card.innerHTML = `<div class="video-error">⚠ Unable to load video</div>`;
            card.classList.add("video-card-error");
        });

        video.load();
    });
}

// ========================================================
// 3. GLOBAL SECURITY (RIGHT CLICK & DEVTOOLS BLOCK)
// ========================================================
document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("keydown", function (e) {
    if (
        e.key === "F12" ||
        // (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toLowerCase() === "u")
    ) {
        e.preventDefault();
    }
});

// ==========================
// Mouse-follow gradient glow
// ==========================
(function () {
    const glow = document.getElementById("cursorGlow");
    if (!glow) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    // Glow ki current (lagging) position
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Lerp: har frame thoda thoda glowX/Y ko mouseX/Y ke kareeb le jao
        const ease = 0.08;  // jitna chhota number, utna zyada delay/lag
        glowX += (mouseX - glowX) * ease;
        glowY += (mouseY - glowY) * ease;

        glow.style.setProperty("--x", `${glowX}px`);
        glow.style.setProperty("--y", `${glowY}px`);

        requestAnimationFrame(animate);
    }

    animate();
})();