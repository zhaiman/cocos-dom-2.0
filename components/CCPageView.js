const domHelper = require('../DOMHelper');
let _proto = cc.PageView.prototype;

_proto.setDomProps = function (element) {
    // let attrib = this.node || this;
    // //
    // let style = attrib.getDomElement().style;
    // style.overflow = "hidden";
};

_proto.updateRenderData = function () {};

module.exports = cc.PageView;