(function() {

  var imported = document.createElement('script');
  imported.src = 'web-animations.js';
  document.head.appendChild(imported);
  var ASSERT_ENABLED = false;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  /** @constructor */
  var AnimatableElement = function(id) {
    try {
      var tag = "#";
      if (s.indexOf(tag) > -1) {
        this._id = id;
      } else{
        this._id = "#" + id;
      }
    } finally {
      console.log('Assigned id '+ id);
    }
  };

  AnimatableElement.prototype = {
    get id() {
      return this._id;
    },
    set id(val) {
      var tag = "#";
      if (s.indexOf(tag) > -1) {
        this._id = val;
      } else{
        this._id = "#" + val;
      }
    },
    clone: function() {
      return new AnimatableElement(this.id);
    },
    animate: function(animationEffect, timingInput) {
      this._animationEffect = animationEffect;
      this._timingInput = timingInput;
      return ([id, animationEffect, timingInput]);
    }
  };

  /** @constructor */
  var ExecutableElement = function(inputs) {
    try {
      var elem = document.getElementById(input[0]);
      var anim = new Animation(elem, input[1], input[2]);
    } finally {
      console.log('Created '+ elem);
      console.log('Created '+ anim);
    }
  };

  ExecutableElement.prototype = {
    get animation() {
      return this._anim;
    },
    set animation(val) {
      this._anim = val;
    },
    get element() {
      return this._elem;
    },
    set element(val) {
      this._elem = val;
    },
    clone: function() {
      return new ExecutableElement(this.elem, this.anim);
    },
    execute: function() {
      document.timeline.play(anim);
    }
  };

  // functions adapted from the original Web Animations polyfill
  window.AnimatableElement = AnimatableElement;
  window.ExecutableElement = ExecutableElement;

})();
