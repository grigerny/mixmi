 // Initialize variables to keep track of Howl instances
 var soundLeft = null;
 var soundRight = null;

  // Initialize variables to keep track of seek
 var currentSeekLeft = 0;
 var currentSeekRight = 0;
  
 // Initialize variable to keep track of rates
 var currentRateLeft = 1;
 var currentRateRight = 1;

// Initialize Wavesurfer instance Left
var wavesurferLeft = WaveSurfer.create({
    container: '#waveformTrack1',
    waveColor: 'violet',
    progressColor: 'purple',
    audioRate: 1, // set the initial playback rate,
    backend: 'WebAudio' // Use the WebAudio backend
});

// Initialize Wavesurfer instance Right
var wavesurferRight = WaveSurfer.create({
    container: '#waveformTrack2',
    waveColor: 'green',
    progressColor: 'lime',
    audioRate: 1, // set the initial playback rate
    backend: 'WebAudio' // Use the WebAudio backend
});

// Event Listeners for Upload Buttons & File Loaders for Left and Right Tracks
document.getElementById('uploadButtonLeft').addEventListener('click', function() {
    document.getElementById('fileInputLeft').click();
  });
  document.getElementById('fileInputLeft').addEventListener('change', function(event) {
    loadTrack(event.target, 'left');
  });
  document.getElementById('uploadButtonRight').addEventListener('click', function() {
    document.getElementById('fileInputRight').click();
  });
  document.getElementById('fileInputRight').addEventListener('change', function(event) {
    loadTrack(event.target, 'right');
  });

  // Event listener for the crossfader
document.getElementById('crossfader').addEventListener('input', function () {
    var value = this.value;
    if(value == 0) {
      soundLeft.volume(1);
      soundRight.volume(0);
  } else if(value == 100) {
      soundLeft.volume(0);
      soundRight.volume(1);
  } else {
      crossfade(value);
  }
  console.log("Volume Left:", soundLeft.volume(), "Volume Right:", soundRight.volume());
});

// Function to handle crossfade
function crossfade(value) {
    var position = value / 100;  // Convert to range 0-1
    var leftVolume = Math.cos(position * Math.PI / 2);
    var rightVolume = Math.cos((1 - position) * Math.PI / 2);

    soundLeft.volume(leftVolume);
    soundRight.volume(rightVolume);
    console.log("Volume Left:", leftVolume, "Volume Right:", rightVolume);
}

// Function to handle the file upload and create a Howl instance for Left and Right tracks
function loadTrack(fileInput, side) {
    var files = fileInput.files;
    if (files.length > 0) { 
        var file = URL.createObjectURL(files[0]); // Create an object URL for the file
            
        // Determine which track to load based on the side and unload or stop the current sound if it exists
         if (side === 'left') {
            if (soundLeft) {
                soundLeft.unload(); // Unload or stop the current sound
                }
                console.log("Reset Left Track");
                soundLeft = new Howl({
                    src: [file],
                    format: ['mp3', 'ogg', 'wav'], // Include formats as needed
                    html5: true, // Depending on your needs
                    // other Howl options...
                });
                console.log("Left Track Successfully Loaded");
                wavesurferLeft.load(file); // Load the track into Wavesurfer for visualization
                console.log("Left Waveform Successfully Loaded");
            
            } else if (side === 'right') {
                if (soundRight) {
                    soundRight.unload(); // Unload or stop the current sound
                }
                console.log("Reset Right Track");
                soundRight = new Howl({
                    src: [file],
                    format: ['mp3', 'ogg', 'wav'], // Include formats as needed
                    html5: true, // Depending on your needs
                    // other Howl options...
                });
                console.log("Right Track Successfully Loaded");
                wavesurferRight.load(file); // Load the track into Wavesurfer for visualization
                console.log("Right Waveform Successfully Loaded");
            }
       
        }
    }



// Stop Buttons for Left Track
var stopButtonLeft = document.getElementById('stopLeft');
stopButtonLeft.addEventListener('click', function() {
  if (soundLeft && wavesurferLeft) {
    soundLeft.stop();  // Stop the sound
    wavesurferLeft.pause(); // Pause the waveform
    wavesurferLeft.seekTo(0); // Seek waveform to the beginning
    console.log("Left track is stopped");
    console.log("Left track is cued to 00:00");
  } else {
    console.log("soundLeft or wavesurferLeft is not initialized.");
  }
});

// Stop Buttons for Right Track
var stopButtonRight = document.getElementById('stopRight');
stopButtonRight.addEventListener('click', function() {
  if (soundRight && wavesurferRight) {
    soundRight.stop();  // Stop the sound
    soundRight.seek(0); // Seek to the beginning
    wavesurferRight.pause(); // Pause the waveform
    wavesurferRight.seekTo(0); // Seek waveform to the beginning
    console.log("Right track is stopped");
    console.log("Right track is cued to 00:00");
} else {
    console.log("soundRight or wavesurferRight is not initialized.");
  }
});

// Toggle Play/Pause for Left Track
document.getElementById('playLeft').addEventListener('click', function() {
    if (soundLeft && wavesurferLeft) {
        if (soundLeft.playing()) {
            soundLeft.pause();
            wavesurferLeft.pause();
            let seekPosition = parseFloat(soundLeft.seek());
            let totalDuration = parseFloat(soundLeft.duration());
            let seekPercent = (seekPosition / totalDuration) * 100;  // Calculate the percentage
            wavesurferLeft.seekTo(seekPercent / 100);
            console.log("Left Track has been paused");
            console.log("Left Current Seek (seconds):", soundLeft.seek(soundLeft));
            console.log("Left Seek percentage (%):", (seekPercent));
        } else {
            // If we're in this else, we're assuming soundLeft is not playing
            soundLeft.play();
            wavesurferLeft.play();
            let seekPosition = parseFloat(soundLeft.seek());
            console.log("Left Track Now Playing");
            console.log("Left Current Seek (seconds):", seekPosition);
            console.log("Left Track Speed (Rate):", currentRateLeft);
            console.log("Left Song Duration (seconds):", soundLeft.duration(soundLeft));
        }
    } else {
        console.log("soundLeft or wavesurferLeft is not initialized.");
    }
});

// Toggle Play/Pause for Right Track
document.getElementById('playRight').addEventListener('click', function() {
    if (soundRight && wavesurferRight) {
      if (soundRight.playing()) {
        soundRight.pause();
        wavesurferRight.pause();
        let seekPosition = parseFloat(soundRight.seek()); 
        let totalDuration = parseFloat(soundRight.duration());
        let seekPercent = (seekPosition / totalDuration) * 100;  // Calculate the percentage
        wavesurferRight.seekTo(seekPercent / 100);
        console.log("Right Track has been paused");
        console.log("Right Current Seek (seconds):", soundRight.seek(soundRight));
        console.log("Right Seek percentage (%):", (seekPercent));
    } else {
        soundRight.play();
        wavesurferRight.play();
        let seekPosition = parseFloat(soundRight.seek());
        console.log("Right Track Now Playing");
        console.log("Right Current Seek (seconds):", seekPosition);
        console.log("Right Track Speed (Rate):", currentRateRight);
        console.log("Right Song Duration (seconds):", soundRight.duration(soundRight));
      }
    } else {
        console.log("soundRight or wavesurferRight is not initialized.");
    }
    });

// Tempo Sliders for Left Track
document.getElementById('tempoSliderLeft').addEventListener('input', function() {
    var rate = this.value;
    currentRateLeft = rate;
    if (soundLeft) {
        soundLeft.rate(rate);
    }
    if (wavesurferLeft) {
        wavesurferLeft.setPlaybackRate(rate);
    }
    console.log("Left Track Tempo:", rate);
    console.log("Left Track Wavesurfer Speed (rate):", rate);
  });
 
  // Tempo Sliders for Right Track
  document.getElementById('tempoSliderRight').addEventListener('input', function() {
    var rate = this.value;
    currentRateRight = rate;
    if (soundRight) {
        soundRight.rate(rate);
    }
    if (wavesurferRight) {
        wavesurferRight.setPlaybackRate(rate);
    }
    console.log("Right Track Tempo:", rate);
    console.log("Right Track Wavesurfer Speed (rate):", rate);
});

