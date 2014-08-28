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

(function() {

  importScripts('web-animations-worker-copy.js');

  /** @constructor */
  var Window = function(worker) {
    this._worker = worker;
    this.pendingRAFList = [];
    this.elements = {};
  };

  Window.prototype = {
    //requesting an animation frame happens here
    requestAnimationFrame: function(callback) {
      this.pendingRAFList.push(callback);
    },
    // setting the currentTime of the correct mockPlayer
    currentTime: function(pos, val) {
      console.log('Worker received the correct currentTime ' + val);
      window.elements[pos].currentTime = parseFloat(val);
    },
    // setting the startTime of the correct mockPlayer
    startTime: function(pos, val) {
      console.log('Worker received the correct startTime ' + val);
     window.elements[pos].startTime = parseFloat(val);
    }
  };

  /** @constructor */
  var AnimatableElement = function(id, worker) {
    try {
      var tag = '#';
      if (id.indexOf(tag) > -1) {
        this._id = id;
      } else {
        this._id = '#' + id;
      }
      this._worker = worker;
    } finally {
      this._animationEffect = null;
      this._timingInput = null;
      this.count = 0;
    }
  };

  AnimatableElement.prototype = {
    // getters and setters
    get id() {
      return this._id;
    },
    set id(val) {
      var tag = '#';
      if (s.indexOf(tag) > -1) {
        this._id = val;
      } else {
        this._id = '#' + val;
      }
    },
    // clone the current animatable element
    clone: function() {
      return new AnimatableElement(this.id, this.worker);
    },
    // accepts an animationEffect dictionary as well as
    // a timingInput dictionary to create an animation
    // returns an instance of a proxy AnimationPlayer
    animate: function(animEffect, tInput) {
      // assign values
      this.count++;
      this._animationEffect = animEffect;
      this._timingInput = tInput;

      // timing model
      this.mockAnim = new Animation(null, null, tInput);
      this.mockPlayer = self.document.timeline.play(this.mockAnim);
      this.currentTime = 0;
      this.startTime = NaN;

      // implement actual animation here
      var msg = ['animate_element', this.id, this.count, animEffect, tInput];
      console.log('\nWorker is sending message ' + msg);
      this._worker.postMessage(msg);
      window.elements[this.id] = this;
      return new RemotePlayer(this._id, this._worker, this.count, this);
    }
  };

  /** @constructor */
  var RemotePlayer = function(id, worker, count, elem) {
    this._id = id;
    this._worker = worker;
    this._elem = elem;
    this.count = count;
  };

  RemotePlayer.prototype = {
    // getters and setters
    get id() {
      return this._id;
    },
    set id(val) {
      this._id = val;
    },
    get worker() {
      return this._worker;
    },
    set worker(val) {
      this._worker = val;
    },
    get elem() {
      return this._elem;
    },
    set elem(val) {
      this._elem = val;
    },
    get currentTime() {
      return this._elem.mockPlayer.currentTime;
    },
    set currentTime(val) {
      this._elem.mockPlayer.currentTime = val;
    },
    get startTime() {
      return this._elem.mockPlayer.startTime;
    },
    set startTime(val) {
      this._elem.mockPlayer.startTime = val;
    },
    // the following functions moce to perform the action stated by their name
    pause: function() {
      this._elem.mockPlayer.pause();
      var msg = ['pause_element', this.id, this.count];
      console.log('\nWorker is sending message ' + msg);
      this._worker.postMessage(msg);
      this.currentTime = NaN;
    },
    play: function() {
      var msg = ['play_element', this.id, this.count];
      console.log('\nWorker is sending message ' + msg);
      this._worker.postMessage(msg);
      this._elem.mockPlayer.play();
      this.currentTime = 0;
      this.startTime = NaN;
    },
    cancel: function() {
      var msg = ['cancel_element', this.id, this.count];
      console.log('\nWorker is sending message ' + msg);
      this._worker.postMessage();
      this._elem.mockPlayer.cancel();
      this.currentTime = NaN;
    },
    finish: function() {
      var msg = ['finish_element', this.id, this.count];
      console.log('\nWorker is sending message ' + msg);
      this._worker.postMessage(msg);
      this._elem.mockPlayer.finish();
      this.currentTime = NaN;
    },
    reverse: function() {
      var msg = ['reverse_element', this.id, this.count];
      console.log('\nWorker is sending message ' + msg);
      this._worker.postMessage(msg);
      this._elem.mockPlayer.reverse();
      this.currentTime = NaN;
    }
  };

  self.AnimatableElement = AnimatableElement;
  self.RemotePlayer = RemotePlayer;
  self.window = new Window();

})();
