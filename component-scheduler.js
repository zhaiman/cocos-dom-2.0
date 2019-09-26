const ComponentScheduler = require('../cocos2d/core/component-scheduler');

let _proto = ComponentScheduler.prototype;

_proto._enableComp = _proto.enableComp;
_proto.enableComp = function (comp, invoker) {
    this._enableComp(comp, invoker);

    if (comp._domElement != null) {
        let style = comp._domElement.style;
        style.visibility = "";
    }
    
};

_proto._disableComp = _proto.disableComp;
_proto.disableComp = function (comp) {
    this._disableComp(comp);

    if (comp._domElement != null) {
        let style = comp._domElement.style;
        style.visibility = "hidden";
    }
};