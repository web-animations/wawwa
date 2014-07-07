var testobj = new AnimatableElement("#myCanvas1", self);
var player;

self.onmessage = function(e) {
    // call animate on it
    var motion = [{left: '0px'}, {left: '100px'}];
    if (e.data == "start") {
	    player = testobj.animate(motion, {duration: 1000, iterations: Infinity});
    } else if (e.data == "pause") {
		player.pause();
    }
}