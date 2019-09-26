/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const ComponentScheduler = require('./component-scheduler');
const renderer = require('./renderer');
const Obj = require('../cocos2d/core/platform/CCObject');
const eventManager = require('../cocos2d/core/event-manager');

let _proto = cc.Director.prototype;
 /*
  * Run main loop of director
  */
_proto.mainLoop = CC_EDITOR ? function (deltaTime, updateAnimate) {
    this._deltaTime = deltaTime;

    // Update
    if (!this._paused) {
        this.emit(cc.Director.EVENT_BEFORE_UPDATE);

        this._compScheduler.startPhase();
        this._compScheduler.updatePhase(deltaTime);

        if (updateAnimate) {
            this._scheduler.update(deltaTime);
        }

        this._compScheduler.lateUpdatePhase(deltaTime);

        this.emit(cc.Director.EVENT_AFTER_UPDATE);
    }

    // Render
    this.emit(cc.Director.EVENT_BEFORE_DRAW);
    renderer.render(this._scene);

    // After draw
    this.emit(cc.Director.EVENT_AFTER_DRAW);

    this._totalFrames++;

} : function (now) {
    if (this._purgeDirectorInNextLoop) {
        this._purgeDirectorInNextLoop = false;
        this.purgeDirector();
    } else {
        // calculate "global" dt
        this.calculateDeltaTime(now);

        // Update
        if (!this._paused) {
            this.emit(cc.Director.EVENT_BEFORE_UPDATE);
            // Call start for new added components
            this._compScheduler.startPhase();
            // Update for components
            this._compScheduler.updatePhase(this._deltaTime);
            // Engine update with scheduler
            this._scheduler.update(this._deltaTime);
            // Late update for components
            this._compScheduler.lateUpdatePhase(this._deltaTime);
            // User can use this event to do things after update
            this.emit(cc.Director.EVENT_AFTER_UPDATE);
            // Destroy entities that have been removed recently
            Obj._deferredDestroy();
        }

        // Render
        this.emit(cc.Director.EVENT_BEFORE_DRAW);
        renderer.render(this._scene);

        // After draw
        this.emit(cc.Director.EVENT_AFTER_DRAW);

        eventManager.frameUpdateListeners();
        this._totalFrames++;
    }
};