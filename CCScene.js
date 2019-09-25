const domHelper = require('./DOMHelper');

let _proto = cc.Scene.prototype;

_proto.getDomElement = function (parentNode) {
    if (this._domElement == null) {
        let element = domHelper.getDomElement('DIV', this, parentNode);
        if (element != null) {
            this.setDomProps(element);
            this._domElement = element;
        }
    }
    return this._domElement;
};

_proto.setDomProps = function (element) {
    element.setAttribute('class', 'node');
};

module.exports = cc.Scene;