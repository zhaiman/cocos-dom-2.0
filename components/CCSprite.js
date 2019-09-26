const RenderComponent = require('./CCRenderComponent');
const domHelper = require('../DOMHelper');

let _proto = cc.Sprite.prototype;

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
    //
    let frame = this.spriteFrame;
    if (frame != null) {
        let texture = frame._texture;
        element.setAttribute('src', texture.url);

        let node = this.node;
        let style = element.style;
        let minh = Math.min(frame.insetTop, frame.insetBottom);
        let minw = Math.min(frame.insetLeft, frame.insetRight);
        let minx = Math.min(minw, minh);
        let width = node.width - minx * 2;
        let height = node.height - minx * 2;
        style.width = `${width}px`;
        style.height = `${height}px`;
        // style.objectFit = 'cover';
        // style.margin = `${1}px ${1}px`;
        // style.width = `100%`;
        // style.height = `100%`;

        let color = node.color;
        // style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
        style.opacity = color.a / 255;
        style.position = 'absolute';

        var tmp = [];
        // tmp.push('rect(');
        // tmp.push(frame.insetTop / texture.height * node.height);
        // tmp.push('px,');
        // tmp.push((1 - frame.insetRight / texture.width) * node.width);
        // tmp.push('px,');
        // tmp.push((1 - frame.insetBottom / texture.height) * node.height);
        // tmp.push('px,');
        // tmp.push(frame.insetLeft / texture.width * node.width);
        // tmp.push('px)');
        // style.clip = tmp.join('');


        style.border = `${minx}px solid rgba(255,255,255,0)`;
        style.borderImageSource = `url(${texture.url})`;
        style.borderImageSlice = `${frame.insetTop} ${frame.insetRight} ${frame.insetBottom} ${frame.insetLeft} fill`;

        // tmp.push(`url(${texture.url}) ${frame.insetLeft - 1}px center/${2}px ${height / (1 - (frame.insetTop + frame.insetBottom) / texture.height)}px no-repeat border-box`);
        // tmp.push(`url(${texture.url}) ${width-frame.insetRight+1}px center/${2}px ${height/(1-(frame.insetTop+frame.insetBottom)/texture.height)}px no-repeat border-box`);
        // style.background = `url(${texture.url}) center/${node.width}px ${node.height}px no-repeat border-box`;
        // style.background = tmp.join(',');
        style.background = `url(${texture.url}) center/${node.width}px ${node.height}px no-repeat border-box`;

        // if (attrib.color._val !== 0xFFFFFFFF) {
        //     let s = attrib.color._val.toString(16);
        //     style.backgroundImage = 'url(' + texture.url + '), linear-gradient(deeppink,deeppink)';
        //     style.backgroundBlendMode = "lighten";
        //     style.backgroundSize = "cover";
        // }
    }
};

_proto.updateRenderData = function () {
    //this._assembler.updateRenderData(this);
    let element = this.getDomElement();
    this.setDomProps(element);
};

module.exports = cc.Sprite;