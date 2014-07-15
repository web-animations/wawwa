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

var testobj = new AnimatableElement('#myCanvas1', self);
var player;

// var testobj1 = new AnimatableElement('#myCanvas2', self);
// var player1;

var motion = [{left: '0px'}, {left: '1000px'}];
// var motion1 = [{left: '0px'}, {left: '300px'}];

self.onmessage = function(e) {
  if (e.data == 'start') {
    player = testobj.animate(motion, {duration: 2000, iterations: Infinity});
    // player1 = testobj1.animate(motion1, {duration: 2000, iterations: 10});
  } else if (e.data == 'pause') {
    player.pause();
    // player1.pause();
  }

  // testing the tick value at both ends
  function tick(t) {
    console.log('worker at time ' + t);
    window.requestAnimationFrame(tick);
  }

  window.requestAnimationFrame(tick);
};
