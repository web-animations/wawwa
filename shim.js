importScripts('web-animations-worker.js');

self.onmessage = function(event) {
  importScripts(event.data[1]);
};
