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
  var ProxyPlayer = function(elemID, animEffect, timingDict, worker) {
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

  ProxyPlayer.prototype = {
    execute: function(val) {
      if (val === 'animate_element') {
        if (this.player === null) {
          this.player = document.timeline.play(this.anim);
        } else {
          this.player.play();
        }
      } else if (val === 'pause_element') {
        this.player.pause();
      } else if (val === 'reverse_element') {
        this.player.reverse();
      } else if (val === 'finish_element') {
        this.player.finish();
      } else if (val === 'cancel_element') {
        this.player.cancel();
      }
    }
  };

  /** @constructor */
  var ListOfElements = function() {
    this.dict = {};
    this.workers = {}; 
    this.ticker(0);
 };

  ListOfElements.prototype = {
    ticker: function (t) {
      for (var elem in this.workers) {
        console.log(t);
        this.workers[elem].postMessage(['requestAnimationFrame', t]);
      }
      requestAnimationFrame(this.ticker.bind(this));      
    },
    find: function(val) {
      return this.dict[val];
    },
    execute: function(inputs, worker) {
      var hold = this.find(inputs[1]);
      if (hold) {
        hold.execute(inputs[0]);
      } else {
        hold = new ProxyPlayer(inputs[1], inputs[2], inputs[3], worker);
        this.dict[inputs[1]] = hold;
        hold.execute(inputs[0]);
      }
    }
  };

  var elementList = new ListOfElements();

  // creates the Web Worker here using a shim
  function createAnimationWorker(name) {
    var worker = new Worker('shim.js');
    elementList.workers[name] = worker;
    worker.postMessage(['name', name]);
    worker.onmessage = function(oEvent) {
      elementList.execute(oEvent.data, worker);
    };
    return worker;
  }

  window.ProxyPlayer = ProxyPlayer;
  window.ListOfElements = ListOfElements;
  window.createAnimationWorker = createAnimationWorker;

})();
