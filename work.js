var testobj = new AnimatableElement('#myCanvas', self);
var player;

var motion = [{left: '0px'}, {left: '1000px'}];
self.onmessage = function(e) {
    if (e.data == 'start') {
        player = testobj.animate(motion, {duration: 2000, iterations: Infinity});
    } else if (e.data == 'pause') {
        player.pause();
    }
};
