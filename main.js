const socket = io();

let localStream;
let userCountEl = document.getElementById("userCount");
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const toggleCamBtn = document.getElementById("toggleCam");
const turnOnCamBtn = document.getElementById("turnOnCam"); // Turn On Camera button
const skipBtn = document.getElementById("skipBtn");
const noPartner = document.getElementById("noPartner");

let cameraOn = true;

// Access the user's camera and microphone
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream; // Assign the stream to the local video element
    turnOnCamBtn.style.display = 'none'; // Hide the "Turn On Camera" button if camera is on
  })
  .catch(err => {
    console.error("Error accessing media devices:", err);
    alert("Error accessing media devices: " + err.message);
  });

// Placeholder logic for remote video (this will be set once a peer connection is established)
remoteVideo.onplaying = () => {
  noPartner.style.display = 'none';
};
remoteVideo.onpause = () => {
  noPartner.style.display = 'block';
};
remoteVideo.onloadedmetadata = () => {
  if (!remoteVideo.srcObject) noPartner.style.display = 'block';
};

// Update the user count
socket.on("userCount", count => {
  if (userCountEl) userCountEl.textContent = count;
});

// Toggle camera on/off
toggleCamBtn.addEventListener("click", () => {
  cameraOn = !cameraOn;
  localStream.getVideoTracks()[0].enabled = cameraOn;
  toggleCamBtn.textContent = cameraOn ? "Turn Off Camera" : "Turn On Camera";
  turnOnCamBtn.style.display = cameraOn ? 'none' : 'inline-block'; // Toggle visibility of "Turn On Camera" button
});

// Turn the camera on if it's off
turnOnCamBtn.addEventListener("click", () => {
  cameraOn = true;
  localStream.getVideoTracks()[0].enabled = cameraOn;
  toggleCamBtn.textContent = "Turn Off Camera";
  turnOnCamBtn.style.display = 'none';
});

// Skip button placeholder (you will add peer connection logic here)
skipBtn.addEventListener("click", () => {
  alert("Skipping... (future peer logic will go here)");
});
