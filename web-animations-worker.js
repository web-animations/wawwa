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
      window.elements[pos].currentTime = parseFloat(val);
      console.log('w end current time is ' + window.elements[pos].currentTime + ' and start time is ' + window.elements[pos].startTime);
    },
    // setting the startTime of the correct mockPlayer
    startTime: function(pos, val) {
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
      this._animationEffect = animEffect;
      this._timingInput = tInput;

      // timing model
      this.mockAnim = new Animation(null, null, tInput);
      this.mockPlayer = self.document.timeline.play(this.mockAnim);
      this.currentTime = 0;
      this.startTime = NaN;

      // implement actual animation here
      this._worker.postMessage(['animate_element', this.id, animEffect, tInput]);
      window.elements[this.id] = this;
      return new AnimationPlayer(this._id, this._worker, this);
    }
  };

  /** @constructor */
  var AnimationPlayer = function(id, worker, elem) {
    this._id = id;
    this._worker = worker;
    this._elem = elem;
  };

  AnimationPlayer.prototype = {
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
      this._worker.postMessage(['pause_element', this.id]);
      this.currentTime = NaN;
    },
    play: function() {
      this._worker.postMessage(['play_element', this.id]);
      this._elem.mockPlayer.play();
      this.currentTime = 0;
      this.startTime = NaN;
    },
    cancel: function() {
      this._worker.postMessage(['cancel_element', this.id]);
      this._elem.mockPlayer.cancel();
    },
    finish: function() {
      this._worker.postMessage(['finish_element', this.id]);
      this._elem.mockPlayer.finish();
    },
    reverse: function() {
      this._worker.postMessage(['reverse_element', this.id]);
      this._elem.mockPlayer.reverse();
    }
  };

  self.AnimatableElement = AnimatableElement;
  self.AnimationPlayer = AnimationPlayer;
  self.window = new Window();

})();
