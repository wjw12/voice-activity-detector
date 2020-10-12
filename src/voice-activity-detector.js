'use strict';

function clamp(value, min, max) {
  return min < max
      ? (value < min ? min : value > max ? max : value)
      : (value < max ? max : value > min ? min : value)
}

function frequencyToIndex(frequency, sampleRate, frequencyBinCount) {
  var nyquist = sampleRate / 2
  var index = Math.round(frequency / nyquist * frequencyBinCount)
  return clamp(index, 0, frequencyBinCount)
}

function fourierAverage(frequencies, minHz, maxHz, sampleRate, binCount) {
  var start = frequencyToIndex(minHz, sampleRate, binCount)
  var end = frequencyToIndex(maxHz, sampleRate, binCount)
  var count = end - start
  var sum = 0
  for (; start < end; start++) {
    sum += frequencies[start] / 255.0
  }
  return count === 0 ? 0 : (sum / count)
}

const vad = function(audioContext, stream, opts) {
  opts = opts || {};
  var defaults = {
    fftSize: 512,
    bufferLen: 512,
    smoothingTimeConstant: 0.8,
    minCaptureFreq: 85,         // in Hz
    maxCaptureFreq: 1000,       // in Hz
    noiseCaptureDuration: 1000, // in ms
    minNoiseLevel: 0.3,         // from 0 to 1
    maxNoiseLevel: 0.7,         // from 0 to 1
    avgNoiseMultiplier: 1.1,
    onVoiceStart: function() {
    },
    onVoiceStop: function() {
    },
    onUpdate: function(val) {
    }
  };

  var options = {};
  for (var key in defaults) {
    options[key] = opts.hasOwnProperty(key) ? opts[key] : defaults[key];
  }
  var baseLevel = 0;
  var voiceScale = 1;
  var activityCounter = 0;
  var activityCounterMin = 0;
  var activityCounterMax = 30;
  var activityCounterThresh = 5;

  var envFreqRange = [];
  var isNoiseCapturing = true;
  var prevVadState = undefined;
  var vadState = false;
  var captureTimeout = null;

  var source = audioContext.createMediaStreamSource(stream);
  var analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = options.smoothingTimeConstant;
  analyser.fftSize = options.fftSize;

  var frequencies = new Uint8Array(analyser.frequencyBinCount);

  connect();

  var raf = null;

  function processVAD() {
    analyser.getByteFrequencyData(frequencies);

    var average = fourierAverage(frequencies, options.minCaptureFreq, options.maxCaptureFreq, analyser.context.sampleRate, analyser.frequencyBinCount);
    if (isNoiseCapturing) {
      envFreqRange.push(average);
      raf = requestAnimationFrame(processVAD);
      return;
    }

    if (average >= baseLevel && activityCounter < activityCounterMax) {
      activityCounter++;
    } else if (average < baseLevel && activityCounter > activityCounterMin) {
      activityCounter--;
    }
    vadState = activityCounter > activityCounterThresh;

    if (prevVadState !== vadState) {
      vadState ? onVoiceStart() : onVoiceStop();
      prevVadState = vadState;
    }
    options.onUpdate(Math.max(0, average - baseLevel) / voiceScale);

    raf = requestAnimationFrame(processVAD);
  }

  if (isNoiseCapturing) {
    console.log('VAD: start noise capturing');
    captureTimeout = setTimeout(init, options.noiseCaptureDuration);
  }

  function init() {
    console.log('VAD: stop noise capturing');
    isNoiseCapturing = false;
    captureTimeout = null;

    envFreqRange = envFreqRange.filter(function(val) {
      return val;
    }).sort();
    var averageEnvFreq = envFreqRange.length ? envFreqRange.reduce(function (p, c) { return Math.min(p, c) }, 1) : (options.minNoiseLevel || 0.1);

    baseLevel = averageEnvFreq * options.avgNoiseMultiplier;
    if (options.minNoiseLevel && baseLevel < options.minNoiseLevel) baseLevel = options.minNoiseLevel;
    if (options.maxNoiseLevel && baseLevel > options.maxNoiseLevel) baseLevel = options.maxNoiseLevel;

    voiceScale = 1 - baseLevel;

    console.log('VAD: base level:', baseLevel);
  }

  function connect() {
    source.connect(analyser);
  }

  function disconnect() {
    analyser.disconnect();
    source.disconnect();
  }

  function destroy() {
    captureTimeout && clearTimeout(captureTimeout);
    disconnect();
  }

  function enable() {
    !raf && processVAD();
  }

  function disable() {
    raf && cancelAnimationFrame(raf);
    captureTimeout && clearTimeout(captureTimeout);
    envFreqRange = [];
  }

  function onVoiceStart() {
    options.onVoiceStart();
  }

  function onVoiceStop() {
    options.onVoiceStop();
  }

  return {enable: enable, disable: disable, destroy: destroy};
};

export default vad;