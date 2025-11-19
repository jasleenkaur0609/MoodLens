//-------------------------------------------
// MoodLens – Enhanced Mood Detection with Full Music List
//-------------------------------------------

// DOM Elements
const video = document.getElementById("camera");
const emotionLabel = document.getElementById("emotionLabel");
const musicSuggest = document.getElementById("musicSuggest");
const moodDescription = document.getElementById("moodDescription");

// --------------------
// Camera Start
// --------------------
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: false
        });

        video.srcObject = stream;
        await video.play();

        console.log("📸 Camera started");
    } catch (error) {
        console.error("Camera error:", error);
        emotionLabel.textContent = "Camera access blocked!";
    }
}

// --------------------
// Load Face-api Models
// --------------------
async function loadModels() {
    if (typeof faceapi === "undefined") {
        console.error("❌ face-api.js not loaded!");
        emotionLabel.textContent = "FaceAPI not loaded!";
        return;
    }

    try {
        console.log("📦 Loading models...");
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ]);

        console.log("🤖 Face models loaded!");
        startDetection();
    } catch (err) {
        console.error("Model load error:", err);
        emotionLabel.textContent = "Model loading failed!";
    }
}

// --------------------
// Detection Loop (once per minute)
// --------------------
let lastMood = null;
function startDetection() {
    updateMood(); // initial call
    setInterval(updateMood, 30000); // update every 1 minute
}

async function updateMood() {
    if (video.paused || video.ended) return;

    const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

    if (!detection) {
        emotionLabel.textContent = "No face detected…";
        musicSuggest.innerHTML = "";
        moodDescription.innerHTML = "";
        lastMood = null;
        return;
    }

    const expressions = detection.expressions;
    const mood = Object.keys(expressions).reduce((a, b) =>
        expressions[a] > expressions[b] ? a : b
    );

    // Only update UI if mood changed
    if (mood !== lastMood) {
        lastMood = mood;
        console.log("Detected mood:", mood);

        emotionLabel.textContent = mood.toUpperCase();
        updateMusic(mood);
        updateDescription(mood);
    }
}

// --------------------
// Music Suggestions (Show all)
// --------------------
function updateMusic(mood) {
    const music = {
        happy: [
            "💛 'Good Life' – OneRepublic",
            "💛 'Happy' – Pharrell Williams",
            "💛 'Uptown Funk' – Bruno Mars",
            "💛 'Can't Stop the Feeling!' – Justin Timberlake",
            "💛 'Shake It Off' – Taylor Swift"
        ],
        sad: [
            "💙 'Fix You' – Coldplay",
            "💙 'Someone Like You' – Adele",
            "💙 'Stay With Me' – Sam Smith",
            "💙 'Let Her Go' – Passenger",
            "💙 'The Night We Met' – Lord Huron"
        ],
        angry: [
            "❤️‍🔥 'Believer' – Imagine Dragons",
            "❤️‍🔥 'Break Stuff' – Limp Bizkit",
            "❤️‍🔥 'Killing in the Name' – Rage Against the Machine",
            "❤️‍🔥 'Smells Like Teen Spirit' – Nirvana",
            "❤️‍🔥 'Bodies' – Drowning Pool"
        ],
        surprised: [
            "💜 'Adventure of a Lifetime' – Coldplay",
            "💜 'Wake Me Up' – Avicii",
            "💜 'Don't Stop Me Now' – Queen",
            "💜 'Titanium' – David Guetta ft. Sia",
            "💜 'Good Time' – Owl City & Carly Rae Jepsen"
        ],
        fearful: [
            "🌫️ 'Stay' – Rihanna",
            "🌫️ 'Creep' – Radiohead",
            "🌫️ 'Breathe Me' – Sia",
            "🌫️ 'Behind Blue Eyes' – Limp Bizkit",
            "🌫️ 'Mad World' – Gary Jules"
        ],
        disgusted: [
            "🟣 'Lovely' – Billie Eilish",
            "🟣 'Everybody Wants to Rule the World' – Tears for Fears",
            "🟣 'Disturbia' – Rihanna",
            "🟣 'Toxic' – Britney Spears",
            "🟣 'Bad Guy' – Billie Eilish"
        ],
        neutral: [
            "☁️ Calm Lo-fi Beats",
            "☁️ Chillhop Essentials",
            "☁️ Ambient Study Music",
            "☁️ Relaxing Piano Tunes",
            "☁️ Nature Sounds Mix"
        ]
    };

    const songs = music[mood] || ["Detecting…"];
    // show all songs as list
    musicSuggest.innerHTML = songs.map(song => `• ${song}`).join("<br>");
}

// --------------------
// Mood Description with emojis
// --------------------
function updateDescription(mood) {
    const desc = {
        happy: "😊 You're feeling joyful and energetic! Spread positivity around you. Perfect time for creativity, socializing, or dancing to your favorite tunes. Enjoy the bright moments!",
        sad: "😢 Feeling a bit down? It's okay to slow down. Take care of yourself, reflect, and do activities that soothe you like journaling, meditating, or listening to calm music.",
        angry: "😡 Anger detected! Step back, breathe deeply, and release tension. Engage in physical activity or listen to energetic music to vent frustration safely.",
        surprised: "😮 Wow! Something unexpected happened? Stay curious, embrace the excitement, and explore new opportunities or ideas that come your way.",
        fearful: "😨 Feeling worried or anxious? Slow down, ground yourself, and use calming practices like deep breathing, meditation, or speaking to someone you trust.",
        disgusted: "🤢 Something is off or unpleasant? Recognize your feelings, distance from negativity, and focus on things that bring you comfort and joy.",
        neutral: "😐 Calm and steady. Your mind is balanced. Ideal moment to plan, reflect, and focus on your daily activities mindfully."
    };

    moodDescription.innerHTML = desc[mood] || "Understanding…";
}

// --------------------
// Initialize
// --------------------
startCamera();
loadModels();
