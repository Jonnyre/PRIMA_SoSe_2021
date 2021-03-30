"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class Wall extends L02_SpaceInvader.SpaceInvaderObject {
        constructor(_name, _position) {
            super(_name, _position, new f.Vector2(0.1, 13.5), "white");
        }
    }
    L02_SpaceInvader.Wall = Wall;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Wall.js.map