"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class Invader extends L02_SpaceInvader.SpaceInvaderObject {
        constructor(_name, _position, _size) {
            super(_name, _position, _size, "invader");
            this.rectBelow = this.rect;
        }
        move(_velocity) {
            let timeSinceLastFrame = f.Loop.timeFrameReal / 1000;
            this.mtxLocal.translateX(timeSinceLastFrame * _velocity);
            this.setRectPosition();
        }
    }
    L02_SpaceInvader.Invader = Invader;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Invader.js.map