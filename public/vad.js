!function(e){var n={};function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}t.m=e,t.c=n,t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{enumerable:!0,get:o})},t.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},t.t=function(e,n){if(1&n&&(e=t(e)),8&n)return e;if(4&n&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(t.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&n&&"string"!=typeof e)for(var r in e)t.d(o,r,function(n){return e[n]}.bind(null,r));return o},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},t.p="",t(t.s=0)}([function(e,n,t){"use strict";function o(e,n,t){var o,r,i,u=n/2,a=Math.round(e/u*t);return o=a,(r=0)<(i=t)?o<r?r:o>i?i:o:o<i?i:o>r?r:o}t.r(n);var r=function(e,n,t){t=t||{};var r={fftSize:512,bufferLen:512,smoothingTimeConstant:.8,minCaptureFreq:85,maxCaptureFreq:1e3,noiseCaptureDuration:1e3,minNoiseLevel:.3,maxNoiseLevel:.7,avgNoiseMultiplier:1.1,onVoiceStart:function(){},onVoiceStop:function(){},onUpdate:function(e){}},i={};for(var u in r)i[u]=t.hasOwnProperty(u)?t[u]:r[u];var a=0,c=1,l=0,f=[],s=!0,m=void 0,p=!1,v=null,d=e.createMediaStreamSource(n),y=e.createAnalyser();y.smoothingTimeConstant=i.smoothingTimeConstant,y.fftSize=i.fftSize;var g=new Uint8Array(y.frequencyBinCount);d.connect(y);var b=null;function S(){y.getByteFrequencyData(g);var e=function(e,n,t,r,i){for(var u=o(n,r,i),a=o(t,r,i),c=a-u,l=0;u<a;u++)l+=e[u]/255;return 0===c?0:l/c}(g,i.minCaptureFreq,i.maxCaptureFreq,y.context.sampleRate,y.frequencyBinCount);if(s)return f.push(e),void(b=requestAnimationFrame(S));e>=a&&l<30?l++:e<a&&l>0&&l--,m!==(p=l>5)&&(p?i.onVoiceStart():i.onVoiceStop(),m=p),i.onUpdate(Math.max(0,e-a)/c),b=requestAnimationFrame(S)}return s&&(console.log("VAD: start noise capturing"),v=setTimeout((function(){console.log("VAD: stop noise capturing"),s=!1,v=null;var e=(f=f.filter((function(e){return e})).sort()).length?f.reduce((function(e,n){return Math.min(e,n)}),1):i.minNoiseLevel||.1;a=e*i.avgNoiseMultiplier,i.minNoiseLevel&&a<i.minNoiseLevel&&(a=i.minNoiseLevel);i.maxNoiseLevel&&a>i.maxNoiseLevel&&(a=i.maxNoiseLevel);c=1-a,console.log("VAD: base level:",a)}),i.noiseCaptureDuration)),{enable:function(){!b&&S()},disable:function(){b&&cancelAnimationFrame(b),v&&clearTimeout(v),f=[]},destroy:function(){v&&clearTimeout(v),y.disconnect(),d.disconnect()}}};window.vad=r}]);