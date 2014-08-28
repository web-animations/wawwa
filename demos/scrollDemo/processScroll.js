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
 * distributed under the License is distrbtriuted on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var prevScrollTop = 0;
var prevTop = 0;

var text = new AnimatableElement('#scroll-content', self);
var playerText;

var scrollbar = new AnimatableElement('#scrollbar-thumb', self);
var playerScrollbar;

self.onmessage = function(e) {
    var height = parseInt(e.data[0], 10);
    var cntHeight = parseInt(e.data[1], 10);
    var trcHeight = parseInt(e.data[2], 10);
    var mean = 50;
    var current = 0;
    var delta = Math.max(-1, Math.min(1, (parseInt(e.data[3], 10) || -1*parseInt(e.data[4], 10))));
    var scrollTop = parseInt(e.data[5], 10) - delta * mean + prevScrollTop;
    var thumbStyleTop = (scrollTop / cntHeight * trcHeight);

    if (prevTop + e.data[6] < e.data[0] && prevTop >= 0) {
        var motion = [{transform: 'translate(0px, ' + (-prevScrollTop) + 'px)'}, 
                      {transform: 'translate(0px, ' + (-scrollTop) + 'px)'}];
        var playerText = text.animate(motion, {duration: 10, fill: 'forwards'});        

        var motion1 = [{transform: 'translate(0px, ' + (prevTop) + 'px)'}, 
                      {transform: 'translate(0px, ' + (thumbStyleTop) + 'px)'}];
        var playerScrollbar = scrollbar.animate(motion1, {duration: 10, fill: 'forwards'});
    }

    prevScrollTop = scrollTop;
    prevTop = thumbStyleTop;
};

