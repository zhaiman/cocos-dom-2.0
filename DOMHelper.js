function getDomElement(type, node, parentNode) {
    let element = document.createElement(type);
    element.setAttribute('id', node.name);

    let parent = parentNode || node.parent;
    let parentElement;
    if (parent != null) {
        parentElement = parent.getDomElement();
    } else {
        parentElement = cc.game.getDomElement();
    }
    parentElement.appendChild(element);
    return element;
};

module.exports = {
    getDomElement,
};