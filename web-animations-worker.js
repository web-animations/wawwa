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
    // accepts an animationEffect dictionary as well as a timingInput dictionary to create an animation
    // returns an instance of a proxy AnimationPlayer
    animate: function(animEffect, tInput) {
      this._animationEffect = animEffect;
      this._timingInput = tInput;
      this._worker.postMessage(['animate_element', this.id, animEffect, tInput]);
      return new AnimationPlayer(this._id, this._worker, this._elem);
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
    // the following functions moce to perform the action stated by their name
    pause: function() {
      this._worker.postMessage(['pause_element', this.id]);
    },
    play: function() {
      this._worker.postMessage(['play_element', this.id]);
    },
    cancel: function() {
      this._worker.postMessage(['cancel_element', this.id]);
    },
    finish: function() {
      this._worker.postMessage(['finish_element', this.id]);
    },
    reverse: function() {
      this._worker.postMessage(['reverse_element', this.id]);
    }
  };

  /** @constructor */
  var Window = function(worker) {
    this._worker = worker;
    this.pendingRAFList = [];
  };

  Window.prototype = {
    requestAnimationFrame: function(callback) {
      this.pendingRAFList.push(callback);
    }
  };

  self.AnimatableElement = AnimatableElement;
  self.AnimationPlayer = AnimationPlayer;
  self.window = new Window();

})();
