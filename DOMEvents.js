// DOMEvents = cc.Class({
//     name: 'DOMEvents',

//     clickCallback: function (param) {
        
//     }
// });

function DOMClickCallback(element) {
    let node = element.node;
    let event = new cc.Event.EventTouch();
    event._eventCode = cc.Event.EventTouch.ENDED;

    event._propagationStopped = event._propagationImmediateStopped = false;
    event.eventPhase = 2;
    event.type = 'touchend';
    event.target = node.node;
    event.eventPhase = 1;
    event.eventPhase = 2;
    event.currentTarget = node.node;
    cc.Component.EventHandler.emitEvents(node.clickEvents, event);
    node.node.emit('click', this);
};
_global.DOMClickCallback = DOMClickCallback;

module.exports = DOMClickCallback;