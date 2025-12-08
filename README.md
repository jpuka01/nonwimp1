# MemeMatcher - Real-Time Emotion Detection with Meme Matching
John Puka (jpuka01)
Ismail Qadiri (iqadir01)

CS086 OOP Nonwimp1 Project

## Project Overview
MemeMatcher detects facial emotions via webcam and displays matching humorous memes in real-time. The system continuously analyzes facial expressions using machine learning and updates the displayed meme based on the detected emotion category.

## Design & Implementation

### Design Decisions
We focus on different aspects for the project:
- face-api.js detects 7 emotions (happy, sad, angry, surprised, neutral, fearful, disgusted), which we mapped to 5 categories for meme matching (treating "fearful" as "sad" and "disgusted" as "angry")
- Dictionary-based system where each emotion category maps to an array of meme file paths, allowing easy expansion
- Set to 300ms intervals (~3 FPS) to balance real-time responsiveness with performance

### Main Features Implementation
1. Model Loading: Asynchronously loads face-api.js TensorFlow models from CDN with progress feedback
2. Webcam Access: Uses MediaDevices API with permission handling and error recovery
3. Face Detection: TinyFaceDetector analyzes video frames with visual bounding box overlay
4. Emotion Extraction: Sorts confidence scores to identify dominant emotion
5. Meme Matching: Automatically displays memes when emotion category changes; index tracking enables cycling through multiple memes per emotion

### Modifications Made
- Emotion mapping: Originally planned 6 emotions including "confused" but face-api.js provides "fearful/disgusted" instead, so we consolidated to 5 practical categories
- UI enhancements: Added real-time confidence percentages and color-coded emotion highlighting for better user feedback
- Performance optimization: Used TinyFaceDetector (lightweight model) instead of SSD MobileNet for faster load times


## UI Design Highlights

### Visual Polish
- Real-time feedback: Live bounding box around detected face, color-coded emotion scores, and status messages keep users informed
- Clear hierarchy: Webcam feed -> dominant emotion -> all scores -> matched meme creates logical visual flow

### User Experience
- Progress indicators during 5-10 second model loading prevent confusion
- Prominent display of dominant emotion with confidence percentage builds trust
- All 7 emotion scores visible simultaneously for transparency
- Meme automatically updates when emotion changes, maintaining engagement


## Technical Features & Challenges

### Interesting Technical Aspects
1. Browser-based ML: Runs TensorFlow.js models entirely client-side with no backend required
2. Canvas overlay system: Transparent canvas layered over video element enables real-time face bounding box without altering video stream
3. Async initialization chain: Models -> Webcam -> Detection loop ensures proper sequencing with comprehensive error handling
4. Emotion state management: Tracks current emotion category and meme indices to prevent unnecessary updates and enable cycling

### Technical Challenges Resolved
- Load time: 6-8MB models take 5-10 seconds; mitigated with loading indicators and status messages
- Detection reliability: Implemented checks for video state, model loading, and face presence to prevent crashes
- Emotion ambiguity: Neutral/fearful overlap resolved by treating ambiguous emotions as "neutral" default


## How to Run

### Requirements
- Modern browser (Chrome, Firefox, or Edge)
- Webcam access permission
- HTTPS connection or localhost environment

### Steps
1. Open meme_matcher.html in a browser using a local server
2. Grant webcam permission when prompted
3. Wait 5-10 seconds for models to load
4. Position your face in the camera view
5. Watch as memes update based on your detected emotion


## Technology Stack
- face-api.js - TensorFlow.js-based emotion detection
- HTML getUserMedia API - Webcam access
- Canvas API - Face detection overlay
- JavaScript - Async/await patterns
- CSS - Gradient backgrounds, flexbox layout
