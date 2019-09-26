const domHelper = require('../DOMHelper');
const HorizontalAlign = ['left', 'center', 'right'];
const VerticalAlign = ['top', 'middle', 'bottom'];
let _proto = cc.Label.prototype;

_proto.getDomElement = function (parentNode) {
    if (this._domElement == null) {
        let element = domHelper.getDomElement('DIV', this, parentNode);
        if (element != null) {
            this._domElement = element;
        }
    }
    return this._domElement;
};

_proto.setDomProps = function (element) {
    let attrib = this.node || this;
    //
    element.innerHTML = this.string;
    let style = element.style;
    style.width = "100%";
    style.height = "100%";
    
    var tmp = [];
    tmp.push(this.fontSize + "px");
    tmp.push(this.fontFamily);
    if (this._isItalic) {
        tmp.push('italic');
    }
    if (this._isBold) {
        tmp.push('bold');
    }
    style.font = tmp.join(' ');

    let color = attrib.color;
    style.color = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a/255})`;

    if (this.verticalAlign === 1) {
        style.lineHeight = `${attrib.height}px`;
    }
    style.textAlign = HorizontalAlign[this.horizontalAlign];
    style.verticalAlign = VerticalAlign[this.verticalAlign];
};

_proto.updateRenderData = function () {
    let element = this.getDomElement()
    this.setDomProps(element);
};

module.exports = cc.Label;