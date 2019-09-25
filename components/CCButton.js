const domHelper = require('../DOMHelper');

let _proto = cc.Button.prototype;

_proto.setDomProps = function (element) {
    // if (this.clickEvents.length > 0) {
    //     let tmp = [];
    //     tmp.push('DOMClickCallback(');
    //     tmp.push('this');
    //     tmp.push(')');
    //     element.setAttribute('onclick', tmp.join(''));
    //     element.node = this;
    // }

    // let style = element.style;
    // style.pointerEvents = 'auto';
}

module.exports = cc.Button;