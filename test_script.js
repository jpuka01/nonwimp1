// MemeMatcher Feasibility Test Script
// Tests: face-api.js loading, webcam access, face detection, emotion extraction

const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const statusDiv = document.getElementById('status');
const dominantEmotionDiv = document.getElementById('dominant-emotion');
const confidenceDiv = document.getElementById('confidence');

let modelsLoaded = false;
let detectionActive = false;

// Update status message
function updateStatus(message, type = 'loading') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

// Update checklist items
function updateCheck(id, complete = true) {
    const element = document.getElementById(id);
    if (element) {
        element.className = complete ? 'complete' : 'error';
    }
}

// Load face-api.js models
async function loadModels() {
    try {
        updateStatus('Loading face detection models... (this may take 5-10 seconds)', 'loading');
        
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';
        
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
        
        modelsLoaded = true;
        updateCheck('check-models', true);
        updateStatus('Models loaded successfully! Requesting webcam access...', 'success');
        
        return true;
    } catch (error) {
        console.error('Error loading models:', error);
        updateCheck('check-models', false);
        updateStatus('Error loading models. Check console for details.', 'error');
        return false;
    }
}

// Start webcam
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 }
        });
        
        video.srcObject = stream;
        
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                // Set canvas dimensions to match video
                overlay.width = video.videoWidth;
                overlay.height = video.videoHeight;
                
                updateCheck('check-webcam', true);
                updateStatus('Webcam active! Detecting faces...', 'success');
                resolve(true);
            };
        });
    } catch (error) {
        console.error('Error accessing webcam:', error);
        updateCheck('check-webcam', false);
        updateStatus('Error: Could not access webcam. Please grant camera permission.', 'error');
        return false;
    }
}

// Detect faces and emotions
async function detectEmotions() {
    if (!video || video.paused || video.ended || !modelsLoaded) {
        return setTimeout(() => detectEmotions(), 100);
    }
    
    try {
        // Run detection with face landmarks and expressions
        const detections = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions();
        
        // Clear canvas
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        
        if (detections) {
            if (!detectionActive) {
                detectionActive = true;
                updateCheck('check-detection', true);
                updateCheck('check-emotions', true);
                updateStatus('Face detected! Analyzing emotions...', 'success');
            }
            
            // Draw detection box
            const box = detections.detection.box;
            ctx.strokeStyle = '#667eea';
            ctx.lineWidth = 3;
            ctx.strokeRect(box.x, box.y, box.width, box.height);
            
            // Get emotions
            const expressions = detections.expressions;
            
            // Find dominant emotion
            const emotionEntries = Object.entries(expressions);
            emotionEntries.sort((a, b) => b[1] - a[1]);
            const [dominantEmotion, confidence] = emotionEntries[0];
            
            // Update dominant emotion display
            dominantEmotionDiv.textContent = dominantEmotion.toUpperCase();
            confidenceDiv.textContent = `Confidence: ${(confidence * 100).toFixed(1)}%`;
            
            // Update all emotion scores
            document.getElementById('happy-score').textContent = (expressions.happy * 100).toFixed(1) + '%';
            document.getElementById('sad-score').textContent = (expressions.sad * 100).toFixed(1) + '%';
            document.getElementById('angry-score').textContent = (expressions.angry * 100).toFixed(1) + '%';
            document.getElementById('surprised-score').textContent = (expressions.surprised * 100).toFixed(1) + '%';
            document.getElementById('neutral-score').textContent = (expressions.neutral * 100).toFixed(1) + '%';
            document.getElementById('fearful-score').textContent = (expressions.fearful * 100).toFixed(1) + '%';
            document.getElementById('disgusted-score').textContent = (expressions.disgusted * 100).toFixed(1) + '%';
            
            // Color-code the dominant emotion item
            document.querySelectorAll('.emotion-item').forEach(item => {
                item.style.borderLeftColor = '#667eea';
                item.style.backgroundColor = '#f8f9fa';
            });
            
            const dominantItem = document.getElementById(`${dominantEmotion}-score`).parentElement;
            dominantItem.style.borderLeftColor = '#764ba2';
            dominantItem.style.backgroundColor = '#667eea20';
            
        } else {
            if (detectionActive) {
                dominantEmotionDiv.textContent = 'NO FACE';
                confidenceDiv.textContent = 'Position your face in the camera';
            }
        }
        
    } catch (error) {
        console.error('Detection error:', error);
    }
    
    // Run detection every 300ms (approximately 3 times per second)
    setTimeout(() => detectEmotions(), 300);
}

// Initialize everything
async function init() {
    console.log('Initializing MemeMatcher Feasibility Test...');
    
    // Load models
    const modelsSuccess = await loadModels();
    if (!modelsSuccess) return;
    
    // Start webcam
    const webcamSuccess = await startWebcam();
    if (!webcamSuccess) return;
    
    // Start detection loop
    detectEmotions();
    
    console.log('Feasibility test running! ✅');
}

// Start when page loads
window.addEventListener('load', () => {
    // Check if face-api is available
    if (typeof faceapi === 'undefined') {
        updateStatus('Error: face-api.js failed to load from CDN', 'error');
        updateCheck('check-models', false);
        return;
    }
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        updateStatus('Error: Your browser does not support webcam access', 'error');
        updateCheck('check-webcam', false);
        return;
    }
    
    init();
});
