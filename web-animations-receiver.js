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

  var imported = document.createElement('script');
  imported.src = 'web-animations.js';
  document.head.appendChild(imported);

  /** @constructor */
  var RemotePlayerProxy = function(elemID, animEffect, timingDict, worker) {
    try {
      var elem = document.querySelector(elemID);
      var anim = new Animation(elem, animEffect, timingDict);
    }
    catch (e) {
      var elem = null;
      var anim = new Animation(elem, animEffect, timingDict);
    }
    this.elemID = elemID;
    this.animEffect = animEffect;
    this.timingDict = timingDict;
    this.anim = anim;
    this.elem = elem;
    this.worker = worker;
    this.player = null;

  };

  RemotePlayerProxy.prototype = {
    // in each case performs the action as dictated by the string passed to it
    execute: function(val) {
      if (val === 'animate_element') {
        if (this.player === null) {
          this.player = document.timeline.play(this.anim);
        } else {
          this.player.play();
        }
        this.worker.postMessage(['report_start_time', this.startTime, this.elemID]);
      } else if (val === 'pause_element') {
        this.player.pause();
      } else if (val === 'reverse_element') {
        this.player.reverse();
      } else if (val === 'finish_element') {
        this.player.finish();
      } else if (val === 'cancel_element') {
        this.player.cancel();
      } else if (val === 'play_element') {
        this.player.play();
        this.worker.postMessage(['report_start_time', this.startTime, this.elemID]);
      }
      this.worker.postMessage(['report_current_time', this.currentTime, this.elemID]);
    },
    // getters and setters
    set currentTime(val) {
      this.player.currentTime = val;
    },
    get currentTime() {
      return this.player.currentTime;
    },
    set startTime(val) {
      this.player.startTime = val;
    },
    get startTime() {
      return this.player.startTime;
    }
  };

  /** @constructor */
  var ProxyMap = function() {
    // create a singleton instance of global list of all RemotePlayerProxys
    if (ProxyMap.prototype._singletonInstance) {
      return ProxyMap.prototype._singletonInstance;
    }
    ProxyMap.prototype._singletonInstance = this;
    this.dict = {};
    this.ticker(0);
 };

  ProxyMap.prototype = {
    // ticker function to send a rAF tick
    ticker: function(t) {
      for (var elem in this.dict) {
        this.dict[elem].worker.postMessage(['requestAnimationFrame', t]);
      }
      requestAnimationFrame(this.ticker.bind(this));
    },
    // search in the dictioary of RemotePlayerProxys
    findDict: function(val) {
      return this.dict[val];
    },
    // execute the instruction as asked for by the worker
    execute: function(inputs, worker) {
      var hold = this.findDict(inputs[1]);
      if (!hold) {
        hold = new RemotePlayerProxy(inputs[1], inputs[2], inputs[3], worker);
        this.dict[inputs[1]] = hold;
      }
      hold.execute(inputs[0]);
    }
  };

  var elementList = new ProxyMap();

  // creates the Web Worker here using shim and executes the command received
  function createAnimationWorker(name) {
    var worker = new Worker('shim.js');
    worker.postMessage(['name', name]);

    worker.onmessage = function(oEvent) {
      elementList.execute(oEvent.data, worker);
    };
    return worker;
  }

  window.RemotePlayerProxy = RemotePlayerProxy;
  window.ProxyMap = ProxyMap;
  window.createAnimationWorker = createAnimationWorker;

})();
