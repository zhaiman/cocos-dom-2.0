const domHelper = require('./DOMHelper');

let _proto = cc.Scene.prototype;

_proto.getDomElement = function (parentNode) {
    if (this._domElement == null) {
        let element = domHelper.getDomElement('DIV', this, parentNode);
        if (element != null) {
            this._domElement = element;
        }
    }
    return this._domElement;
};

module.exports = cc.Scene;