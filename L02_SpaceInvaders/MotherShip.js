"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class MotherShip extends L02_SpaceInvader.SpaceInvaderObject {
        constructor(_name, _position) {
            super(_name, _position, new f.Vector2(2, 1));
        }
    }
    L02_SpaceInvader.MotherShip = MotherShip;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=MotherShip.js.map