/**
 * Copyright 2012 Google Inc. All Rights Reserved.
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
    clone: function() {
      return new AnimatableElement(this.id, this.worker);
    },
    // accepts an animationEffect dictionary as well as a timingInput dictionary
    animate: function(animEffect, tInput) {
      this._animationEffect = animEffect;
      this._timingInput = tInput;
      this._worker.postMessage(['animate', this.id, animEffect, tInput]);
      return new AnimationPlayer(this._id, this._worker);
    }
  };

  /** @constructor */
  var AnimationPlayer = function(id, worker) {
    this._id = id;
    this._worker = worker;
  };

  AnimationPlayer.prototype = {
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
    pause: function() {
      this._worker.postMessage(['pause', this.id]);
    },
    play: function() {
      this._worker.postMessage(['play', this.id]);
    },
    cancel: function() {
      this._worker.postMessage(['cancel', this.id]);
    },
    finish: function() {
      this._worker.postMessage(['finish', this.id]);
    },
    reverse: function() {
      this._worker.postMessage(['reverse', this.id]);
    }
  };


  // functions adapted from the original Web Animations polyfill
  self.AnimatableElement = AnimatableElement;
  self.AnimationPlayer = AnimationPlayer;

})();
