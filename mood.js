// DOM Elements
const video = document.getElementById("camera");
const emotionLabel = document.getElementById("emotionLabel");
const musicSuggest = document.getElementById("musicSuggest");
const moodDescription = document.getElementById("moodDescription");
const noteInput = document.getElementById("noteInput");
const saveMoodBtn = document.getElementById("saveMoodBtn");
const saveSuccess = document.getElementById("saveSuccess");

// --------------------
// Start Camera
// --------------------
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
    video.srcObject = stream;
    await video.play();
    console.log("📸 Camera started");
  } catch (error) {
    console.error("Camera error:", error);
    emotionLabel.textContent = "Camera access blocked!";
  }
}

// --------------------
// Load Face API Models
// --------------------
async function loadModels() {
  if (typeof faceapi === "undefined") {
    console.error("❌ face-api.js not loaded!");
    emotionLabel.textContent = "FaceAPI not loaded!";
    return;
  }
  try {
    console.log("📦 Loading face-api models...");
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models")
    ]);
    console.log("🤖 Models loaded!");
    startDetection();
  } catch (err) {
    console.error("Model load error:", err);
    emotionLabel.textContent = "Model loading failed!";
  }
}

// --------------------
// Detection Loop
// --------------------
let lastMood = null;
function startDetection() {
  updateMood();
  setInterval(updateMood, 10000);
}

async function updateMood() {
  if (video.paused || video.ended) return;

  const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                                 .withFaceExpressions();

  if (!detection) {
    emotionLabel.textContent = "No face detected…";
    musicSuggest.innerHTML = "";
    moodDescription.innerHTML = "";
    lastMood = null;
    return;
  }

  const expressions = detection.expressions;
  const mood = Object.keys(expressions).reduce((a,b) => expressions[a] > expressions[b] ? a : b);

  if (mood !== lastMood) {
    lastMood = mood;
    emotionLabel.textContent = mood.toUpperCase();
    updateBackground(mood);
    updateMusic(mood);
    updateDescription(mood);
  }
}

// --------------------
// Background color per mood
// --------------------
function updateBackground(mood) {
  const colors = {
    happy:'#3a352b',
  sad:'#2b3a4a',
  angry:'#4a2b2b',
  surprised:'#4a2b4a',
  neutral:'#3a3a3a'
  };
  document.body.style.background = colors[mood] || "#05060d";
}

// --------------------
// Music suggestions
// --------------------
function updateMusic(mood) {
  const music = {
    happy: ["💛 Good Life – OneRepublic","💛 Happy – Pharrell Williams","💛 Good as Hell – Lizzo","💛 Walking on Sunshine – Katrina & The Waves","💛 On Top of the World – Imagine Dragons","💛 Firework – Katy Perry"],
    sad: ["💙 Fix You – Coldplay","💙 All I Want – Kodaline","💙 When the Party's Over – Billie Eilish","💙 Jealous – Labrinth","💙 Before You Go – Lewis Capaldi","💙 Easy on Me – Adele"],
    angry: ["🔥 Believer – Imagine Dragons","🔥 Stronger – Kanye West","🔥 Warriors – Imagine Dragons","🔥 Till I Collapse – Eminem","🔥 Radioactive – Imagine Dragons","🔥 Lose Yourself – Eminem"],
    surprised: ["💜 Adventure of a Lifetime – Coldplay","💜 Wake Me Up – Avicii","💜 Good Time – Owl City & Carly Rae Jepsen","💜 Titanium – David Guetta ft Sia","💜 Rather Be – Clean Bandit","💜 Pompeii – Bastille"],
    fearful: ["🌫️ Breathe Me – Sia","🌫️ The Night We Met – Lord Huron","🌫️ Lovely – Billie Eilish","🌫️ Skinny Love – Birdy","🌫️ Say Something – A Great Big World","🌫️ All I Want – Olivia Rodrigo (cover)"],
    disgusted: ["🟣 Everybody Wants to Rule the World – Tears for Fears","🟣 Bad Guy – Billie Eilish","🟣 Toxic – Britney Spears","🟣 Disturbia – Rihanna","🟣 Royals – Lorde","🟣 Numb – Linkin Park"],
    neutral: ["☁️ Lofi Chill Beats","☁️ Peaceful Piano","☁️ Relaxing Study Music","☁️ Soft Ambient Mix","☁️ Stress Relief Nature Sounds","☁️ Deep Focus Playlist"]
  };
  musicSuggest.innerHTML = music[mood].map(s => `• ${s}`).join("<br>");
}

// --------------------
// Mood descriptions
// --------------------
function updateDescription(mood) {
  const desc = {
    happy: "😊 You seem to be full of light and warmth! Happiness opens creativity, boosts confidence, and improves your ability to connect with others. Enjoy the bright energy!",
    sad: "😢 Your emotions feel heavy. Sadness is natural — hydrate, sit somewhere calm, or do a comforting activity. Feelings pass, you are not alone.",
    angry: "😡 Strong energy inside — anger signals something feels unfair. Take slow breaths, walk, or put on empowering music to release tension safely.",
    surprised: "😮 Something unexpected caught your attention. Your mind is alert and curious. Explore a new idea or try something fun.",
    fearful: "😨 You might feel anxious or uncertain. Ground yourself by breathing slowly, listening to calm music, or talking to someone comforting.",
    disgusted: "🤢 Something feels off. Distance yourself from negativity, focus on uplifting music or activities to cleanse your mood.",
    neutral: "😐 Your emotional state is balanced and steady. Perfect for focusing on tasks, planning, and being productive."
  };
  moodDescription.innerHTML = desc[mood] || "Processing…";
}

// --------------------
// Save Mood to Firestore
// --------------------
saveMoodBtn.addEventListener("click", async () => {
  if (!lastMood) {
    alert("No mood detected yet!");
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    alert("Please login first!");
    return;
  }

  const note = noteInput.value.trim();
  try {
    await db.collection("mood").add({
      userID: user.uid,
      mood: lastMood,
      note: note,
      date: new Date().toISOString()
    });
    saveSuccess.style.display = "block";
    noteInput.value = "";
    setTimeout(() => saveSuccess.style.display = "none", 3000);
  } catch (err) {
    console.error("Error saving mood:", err);
    alert("Failed to save mood!");
  }
});

// --------------------
// Initialize
// --------------------
startCamera();
loadModels();
