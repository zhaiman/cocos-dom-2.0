/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const debug = require('../cocos2d/core/CCDebug');

cc.game.__initRenderer = cc.game._initRenderer;
cc.game._initRenderer = function () {
    // Avoid setup to be called twice.
    if (this._rendererInitialized) return;

    this.config.renderMode = 1;
    this.__initRenderer();

    // this.renderType = this.RENDER_TYPE_DOM;

    let parent = this.canvas.parentNode;
    this.canvas.remove();
    let element = document.createElement('DIV');
    element.setAttribute('id', 'GameCanvas');
    element.setAttribute('oncontextmenu', 'event.preventDefault()');
    element.setAttribute('tabindex', '99');
    element.setAttribute('class', 'gameCanvas');
    // element.setAttribute('width', '300');
    // element.setAttribute('height', '150');
    let style = element.style;
    style.background = "black";
    // style.width = '300px';
    // style.height = '150px';

    parent.appendChild(element);

    this.canvas = element;
};

//Run game.
cc.game.__runMainLoop = cc.game._runMainLoop;
cc.game._runMainLoop = function () {
    if (CC_EDITOR) {
        return;
    }
    var self = this,
        callback, config = self.config,
        director = cc.director,
        game = cc.game,
        frameRate = config.frameRate;

    debug.setDisplayStats(config.showFPS);

    callback = function (now) {
        if (!self._paused) {
            self._intervalId = window.requestAnimFrame(callback);
            if (!CC_JSB && !CC_RUNTIME) {
                if (game.skip_step) {
                    game.skip_step = false;
                    return;
                }
            }
            game.skip_step = true;
            director.mainLoop(now);
        }
    };

    self._intervalId = window.requestAnimFrame(callback);
    self._paused = false;
};

cc.game.getDomElement = function () {
    return this.canvas;
};

module.exports = cc.game;