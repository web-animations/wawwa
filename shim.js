/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var userOnMessageHandler = undefined;
importScripts('web-animations-worker.js');

self.onmessage = function(event) {
  if (event.data[0] === 'requestAnimationFrame') {
    var oldRAFs = window.pendingRAFList;
    window.pendingRAFList = [];
    oldRAFs.forEach(function(raf) {
      raf(event.data[1]);
    });
  } else if (event.data[0] === 'name') {
    importScripts(event.data[1]);
  } else if (event.data[0] == 'report_time') {
    window.elements[event.data[2]].currentTime = parseFloat(event.data[1]);
  } else if (userOnMessageHandler !== undefined) {
    userOnMessageHandler(event);
  }
};

Object.defineProperty(self, 'onmessage', {
  get: function() { return userOnMessageHandler; },
  set: function(f) { userOnMessageHandler = f; }
});
