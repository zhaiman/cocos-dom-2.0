const RenderFlow = require('../../cocos2d/core/renderer/render-flow');

const DONOTHING = 0;
const LOCAL_TRANSFORM = 1 << 0;
const WORLD_TRANSFORM = 1 << 1;
const TRANSFORM = LOCAL_TRANSFORM | WORLD_TRANSFORM;
const UPDATE_RENDER_DATA = 1 << 2;
const OPACITY = 1 << 3;
const RENDER = 1 << 4;
const CUSTOM_IA_RENDER = 1 << 5;
const CHILDREN = 1 << 6;
const POST_UPDATE_RENDER_DATA = 1 << 7;
const POST_RENDER = 1 << 8;
const FINAL = 1 << 9;

let _batcher;
let _cullingMask = 0;

function RenderFlow_New() {
    let renderFlow = new RenderFlow();
    renderFlow._func = init;
    return renderFlow;
};

// function convertTransform(node) {
//     let domElement = node.getDomElement();
//     if (domElement != null) {
//         // update dom pos
//         let style = domElement.style;
//         if (node instanceof cc.Scene) {
//             let view = cc.view;
//             style.width = view._designResolutionSize.width + 'px';
//             style.height = view._designResolutionSize.height + 'px';
//         } else {
//             let convX = node.width * node.anchorX;
//             var vec2 = node.convertToWorldSpace(cc.v2(convX, node.height * node.anchorY));
//             let view = cc.view;
//             vec2.y = view._designResolutionSize.height - vec2.y;

//             style.left = (vec2.x) + 'px';
//             style.top = (vec2.y) + 'px';
//             style.width = node.width + 'px';
//             style.height = node.height + 'px';

//             let anchorPointY = (1 - node.anchorY);
//             let convY = node.height * anchorPointY;
//             var tmp = [];
//             tmp.push('translate(');
//             tmp.push((-convX) + 'px');
//             tmp.push(',');
//             tmp.push((-convY) + 'px');
//             tmp.push(')');

//             let scaleX = node.getLocalScaleX();
//             let scaleY = node.getLocalScaleY();
//             if ((scaleX !== 1) || (scaleY !== 1)) {
//                 tmp.push(' scale(');
//                 tmp.push(scaleX);
//                 tmp.push(',');
//                 tmp.push(scaleY);
//                 tmp.push(')');
//             }

//             let rotation = node.getLocalAngle();
//             if (rotation !== 0) {
//                 tmp.push(' rotate(');
//                 tmp.push((-rotation) / 360);
//                 tmp.push('turn)');
//             }

//             if ((node._skewX !== 0) || (node._skewY !== 0)) {
//                 tmp.push(' skew(');
//                 tmp.push(node._skewX);
//                 tmp.push(',');
//                 tmp.push(node._skewY);
//                 tmp.push(')');
//             }

//             if (tmp.length > 0) {
//                 style.transform = tmp.join('');
//             }

//             tmp = []
//             tmp.push(Math.floor(node.anchorX * 100) + "%");
//             tmp.push(Math.floor(anchorPointY * 100) + "%");
//             style.transformOrigin = tmp.join('');
//         }
//     }
// };

function convertTransform(node) {
    let domElement = node.getDomElement();
    if (domElement != null) {
        // update dom pos
        let style = domElement.style;
        if (node instanceof cc.Scene) {
            let view = cc.view;
            style.width = view._designResolutionSize.width + 'px';
            style.height = view._designResolutionSize.height + 'px';
        } else {
            let anchorPointY = (1 - node.anchorY);
            let convX = node.width * node.anchorX;
            let convY = node.height * anchorPointY;
            var vec2 = cc.v2(node.x - convX, node.y + convY);
            let parent = node.parent;
            if (parent instanceof cc.Scene) {
                let view = cc.view;
                vec2.y = view._designResolutionSize.height - vec2.y;
            } else {
                let offsetX = parent.width * parent.anchorX;
                let offsetY = parent.height * (1 - parent.anchorY);
                vec2.x = vec2.x + offsetX;
                vec2.y = offsetY - vec2.y;
            }
            
            style.left = (vec2.x) + 'px';
            style.top = (vec2.y) + 'px';
            style.width = node.width + 'px';
            style.height = node.height + 'px';
            
            let convY1 = node.height * anchorPointY;
            var tmp = [];
            // tmp.push('translate(');
            // tmp.push((-convX) + 'px');
            // tmp.push(',');
            // tmp.push((-convY1) + 'px');
            // tmp.push(')');

            let scaleX = node.scaleX;
            let scaleY = node.scaleY;
            if ((scaleX !== 1) || (scaleY !== 1)) {
                tmp.push(' scale(');
                tmp.push(scaleX);
                tmp.push(',');
                tmp.push(scaleY);
                tmp.push(')');
            }

            let rotation = node.angle;
            if (rotation !== 0) {
                tmp.push(' rotate(');
                tmp.push((-rotation) / 360);
                tmp.push('turn)');
            }

            if ((node._skewX !== 0) || (node._skewY !== 0)) {
                tmp.push(' skew(');
                tmp.push(node._skewX);
                tmp.push(',');
                tmp.push(node._skewY);
                tmp.push(')');
            }

            if (tmp.length > 0) {
                style.transform = tmp.join('');
            }

            tmp = []
            tmp.push(Math.floor(node.anchorX * 100) + "%");
            tmp.push(Math.floor(anchorPointY * 100) + "%");
            style.transformOrigin = tmp.join('');
        }
    }
};

let _proto = RenderFlow.prototype;
_proto._doNothing = function () {};

_proto._localTransform = function (node) {
    node._updateLocalMatrix();
    node._renderFlag &= ~LOCAL_TRANSFORM;

    // convertTransform(node);
    
    this._next._func(node);
};

_proto._worldTransform = function (node) {
    cc.game.skip_step = false;

    _batcher.worldMatDirty++;

    let t = node._matrix;
    let position = node._position;
    t.m12 = position.x;
    t.m13 = position.y;
    t.m14 = position.z;

    node._mulMat(node._worldMatrix, node._parent._worldMatrix, t);
    node._renderFlag &= ~WORLD_TRANSFORM;

    convertTransform(node);
    
    this._next._func(node);

    _batcher.worldMatDirty--;
};

_proto._opacity = function (node) {
    cc.game.skip_step = false;
    _batcher.parentOpacityDirty++;

    let comp = node._renderComponent;
    if (comp && comp._updateColor) comp._updateColor();

    let element = comp.getDomElement();
    let style = element.style;
    let color = node.color;
    // style.backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a / 255})`;
    style.opacity = color.a / 255;

    node._renderFlag &= ~OPACITY;
    this._next._func(node);

    _batcher.parentOpacityDirty--;
};

_proto._updateRenderData = function (node) {
    cc.game.skip_step = false;
    let comp = node._renderComponent;
    comp.updateRenderData(comp);
    node._renderFlag &= ~UPDATE_RENDER_DATA;
    this._next._func(node);
};

_proto._render = function (node) {
    // let comp = node._renderComponent;
    // _batcher._commitComp(comp, comp._assembler, node._cullingMask);
    this._next._func(node);
};

_proto._customIARender = function (node) {
    // let comp = node._renderComponent;
    // _batcher._commitIA(comp, comp._assembler, node._cullingMask);
    this._next._func(node);
};

_proto._children = function (node) {
    let cullingMask = _cullingMask;
    let batcher = _batcher;

    let parentOpacity = batcher.parentOpacity;
    let opacity = (batcher.parentOpacity *= (node._opacity / 255));

    let worldTransformFlag = batcher.worldMatDirty ? WORLD_TRANSFORM : 0;
    let worldOpacityFlag = batcher.parentOpacityDirty ? OPACITY : 0;
    let worldDirtyFlag = worldTransformFlag | worldOpacityFlag;

    let children = node._children;
    for (let i = 0, l = children.length; i < l; i++) {
        let c = children[i];

        // Advance the modification of the flag to avoid node attribute modification is invalid when opacity === 0.
        c._renderFlag |= worldDirtyFlag;
        if (!c._activeInHierarchy || c._opacity === 0) continue;

        // TODO: Maybe has better way to implement cascade opacity
        let colorVal = c._color._val;
        c._color._fastSetA(c._opacity * opacity);
        flows[c._renderFlag]._func(c);
        c._color._val = colorVal;
    }

    batcher.parentOpacity = parentOpacity;

    this._next._func(node);
};

_proto._postUpdateRenderData = function (node) {
    let comp = node._renderComponent;
    comp._postAssembler && comp._postAssembler.updateRenderData(comp);
    node._renderFlag &= ~POST_UPDATE_RENDER_DATA;
    this._next._func(node);
};

_proto._postRender = function (node) {
    let comp = node._renderComponent;
    _batcher._commitComp(comp, comp._postAssembler, node._cullingMask);
    this._next._func(node);
};

const EMPTY_FLOW = RenderFlow_New();
EMPTY_FLOW._func = EMPTY_FLOW._doNothing;
EMPTY_FLOW._next = EMPTY_FLOW;

let flows = {};

function createFlow(flag, next) {
    let flow = RenderFlow_New();
    flow._next = next || EMPTY_FLOW;

    switch (flag) {
        case DONOTHING:
            flow._func = flow._doNothing;
            break;
        case LOCAL_TRANSFORM:
            flow._func = flow._localTransform;
            break;
        case WORLD_TRANSFORM:
            flow._func = flow._worldTransform;
            break;
        case OPACITY:
            flow._func = flow._opacity;
            break;
        case UPDATE_RENDER_DATA:
            flow._func = flow._updateRenderData;
            break;
        case RENDER:
            flow._func = flow._render;
            break;
        case CUSTOM_IA_RENDER:
            flow._func = flow._customIARender;
            break;
        case CHILDREN:
            flow._func = flow._children;
            break;
        case POST_UPDATE_RENDER_DATA:
            flow._func = flow._postUpdateRenderData;
            break;
        case POST_RENDER:
            flow._func = flow._postRender;
            break;
    }

    return flow;
}

function getFlow(flag) {
    let flow = null;
    let tFlag = FINAL;
    while (tFlag > 0) {
        if (tFlag & flag)
            flow = createFlow(tFlag, flow);
        tFlag = tFlag >> 1;
    }
    return flow;
}

// 
function init(node) {
    let flag = node._renderFlag;
    let r = flows[flag] = getFlow(flag);
    r._func(node);
}

RenderFlow.flows = flows;
RenderFlow.createFlow = createFlow;
RenderFlow.visit = function (scene) {
    // _batcher.reset();
    _batcher.walking = true;

    _cullingMask = 1 << scene.groupIndex;

    if (scene._renderFlag & WORLD_TRANSFORM) {
        _batcher.worldMatDirty++;
        scene._calculWorldMatrix();
        scene._renderFlag &= ~WORLD_TRANSFORM;

        flows[scene._renderFlag]._func(scene);

        _batcher.worldMatDirty--;
    } else {
        flows[scene._renderFlag]._func(scene);
    }

    _batcher.terminate();
    _batcher.walking = false;
};

RenderFlow.init = function (batcher) {
    _batcher = batcher;

    flows[0] = EMPTY_FLOW;
    for (let i = 1; i < FINAL; i++) {
        flows[i] = RenderFlow_New();
    }
};

module.exports = cc.RenderFlow = RenderFlow;