const domHelper = require('../DOMHelper');

let _proto = cc.Sprite.prototype;

_proto.getDomElement = function (parentNode) {
    if (this._domElement == null) {
        let element = domHelper.getDomElement('IMG', this, parentNode);
        if (element != null) {
            this._domElement = element;
        }
    }
    return this._domElement;
};

_proto.setDomProps = function (element) {
    //
    let frame = this.spriteFrame;
    let texture = frame._texture;

    element.setAttribute('src', texture.url);

    let style = element.style;
    style.width = "100%";
    style.height = "100%";
    // if (attrib.color._val !== 0xFFFFFFFF) {
    //     let s = attrib.color._val.toString(16);
    //     style.backgroundImage = 'url(' + texture.url + '), linear-gradient(deeppink,deeppink)';
    //     style.backgroundBlendMode = "lighten";
    //     style.backgroundSize = "cover";
    // }
};

_proto.updateRenderData = function () {
    //this._assembler.updateRenderData(this);
};

module.exports = cc.Sprite;