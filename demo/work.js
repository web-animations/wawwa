importScripts('worker-side.js')

// create the animatable element
var testobj = new AnimatableElement("#myCanvas", self);
var player;

// var testobj2 = new AnimatableElement("#myCanvas1", self);
// var player1;

self.onmessage = function(e) {
    // call animate on it
    var motion = [{left: '0px'}, {left: '1000px'}];
    if (e.data == "start") {
	    player = testobj.animate(motion, {duration: 2000, iterations: Infinity});
    } else if (e.data == "pause") {
		player.pause();
    }

  //   motion = [{left: '0px'}, {left: '100px'}];
  //   if (e.data == "start") {
	 //    player1 = testobj2.animate(motion, {duration: 1000, iterations: Infinity});
  //   } else if (e.data == "pause") {
		// player1.pause();
  //   }
}