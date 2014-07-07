(function() {

  var imported = document.createElement('script');
  imported.src = 'web-animations.js';
  document.head.appendChild(imported);
  var ASSERT_ENABLED = false;
  var SVG_NS = 'http://www.w3.org/2000/svg';

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
      if (val == 'animate') {
        if (this.player == null) {
          this.player = document.timeline.play(this.anim);
        } else {
          this.player.play();
        }
      } else if (val == 'pause') {
        this.player.pause();
      } else if (val == 'reverse') {
        this.player.reverse();
      } else if (val == 'finish') {
        this.player.finish();
      } else if (val == 'cancel') {
        this.player.cancel();
      }
    }
  };

  /** @constructor */
  var ListOfElements = function() {
    this.dict = {};
  };

  ListOfElements.prototype = {
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

  function createAnimationWorker(name) {
    var worker = new Worker('shim.js');
    worker.postMessage(['config', name]);

    worker.onmessage = function(oEvent) {
      elementList.execute(oEvent.data, worker);
    };
    return worker;
  }

  // functions adapted from the original Web Animations polyfill
  window.ProxyPlayer = ProxyPlayer;
  window.ListOfElements = ListOfElements;
  window.createAnimationWorker = createAnimationWorker;


})();


