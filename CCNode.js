const domHelper = require('./DOMHelper');

let _proto = cc.Node.prototype;

_proto.getDomElement = function (parentNode) {
    if (this._domElement == null) {
        let element = domHelper.getDomElement('DIV', this, parentNode);
        if (element != null) {
            this._domElement = element;
            let renderComponent = this._renderComponent;
            if (renderComponent != null) {
                let childElement = renderComponent.getDomElement(this);
                if (renderComponent.setDomProps != null) {
                    renderComponent.setDomProps(childElement);
                }
            }
            this.setDomProps(element);

            for (let i in this._components) {
                let component = this._components[i];
                if ((component!=renderComponent) && (component.setDomProps != null)) {
                    component.setDomProps(element);
                }
            }
        }
    }
    return this._domElement;
};

_proto.setDomProps = function (element) {
    // let style = element.style;
    // style.position = 'absolute';
    // style.pointerEvents = 'none';
    // style.overflow = "hidden";

    element.setAttribute('class', 'node');
};

_proto.getLocalScaleX = function () {
    if (this.parent !== null) {
        return this.scaleX * this.parent.getLocalScaleX();
    }
    return this.scaleX;
}

_proto.getLocalScaleY = function () {
    if (this.parent !== null) {
        return this.scaleY * this.parent.getLocalScaleY();
    }
    return this.scaleY;
}

_proto.getLocalAngle = function () {
    if (this.parent !== null) {
        return this.angle + this.parent.getLocalAngle();
    }
    return this.angle;
}

module.exports = cc.Node;