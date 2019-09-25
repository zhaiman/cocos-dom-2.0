const domHelper = require('../DOMHelper');
let _proto = cc.RichText.prototype;


_proto.setDomProps = function (element) {
    
};

_proto.updateRenderData = function () {
    let element = this.node.getDomElement()
    element.innerHTML = this.string;
};

module.exports = cc.RichText;