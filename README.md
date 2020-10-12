# Voice Activity Detector

`src/voice-activity-detector.js` is a simple VAD module made with Web Audio API in ES6 import/export syntax. The project uses Webpack to build a minified JS file `public/vad.js` that works in standalone mode.

It triggers callback functions `onVoiceStart` and `onVoiceStop`when audio energy within a certain frequency range exceeds or drops below a threshold. It calls `onUpdate` with the argument being the relative audio energy level every animation frame.

## Default options
```
{
  fftSize: 512,
  bufferLen: 512,
  smoothingTimeConstant: 0.8,
  minCaptureFreq: 85,         // in Hz
  maxCaptureFreq: 1000,        // in Hz
  noiseCaptureDuration: 1000, // in ms
  minNoiseLevel: 0.3,         // from 0 to 1
  maxNoiseLevel: 0.7,         // from 0 to 1
  avgNoiseMultiplier: 1.1,
  onVoiceStart: function() {},
  onVoiceStop: function() {},
  onUpdate: function(val) {}
}
```

## Usage
```
// need to load 'vad.js' 
const vad = window.vad
// or the following if uses ES6 module import
// import vad from './voice-activity-detector'

var isVadActive = false

const opts = {
    // you can change default parameters
    
    onVoiceStart: function() {
        console.log('voice start')
        isVadActive = true
    },
    onVoiceStop: function() {
        console.log('voice stop')
        isVadActive = false
    },
    onUpdate: function(val) {
        // add custom update logic here
        // to be called per requestAnimationFrame
    }
 }

// initialize the module
var vadControl = vad(audioContext, audioStream, opts)

// start
vadControl.enable()

// stop
vadControl.disable()

// destroy and clean up internal timers
vadControl.destroy()
```
