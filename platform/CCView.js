cc.view._enableAntiAlias = cc.view.enableAntiAlias;
cc.view.enableAntiAlias = function (enabled) {
}

/**
 * !#en
 * Sets the resolution policy with designed view size in points.<br/>
 * The resolution policy include: <br/>
 * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
 * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
 * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
 * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
 * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
 * [cc.ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by cc.ResolutionPolicy<br/>
 * !#zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
 * @method setDesignResolutionSize
 * @param {Number} width Design resolution width.
 * @param {Number} height Design resolution height.
 * @param {ResolutionPolicy|Number} resolutionPolicy The resolution policy desired
 */
cc.view._setDesignResolutionSize = cc.view.setDesignResolutionSize;
cc.view.setDesignResolutionSize = function (width, height, resolutionPolicy) {
    // Defensive code
    if (!(width > 0 || height > 0)) {
        cc.logID(2200);
        return;
    }

    this._setDesignResolutionSize(width, height, resolutionPolicy);
    
    let style = cc.game.canvas.style;
    style.width = width + 'px';
    style.height = height + 'px';
};