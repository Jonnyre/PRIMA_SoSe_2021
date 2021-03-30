"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class Cover extends L02_SpaceInvader.SpaceInvaderObject {
        constructor(_name, _position) {
            super(_name, _position, new f.Vector2(1.5, 1.5), "white");
        }
    }
    L02_SpaceInvader.Cover = Cover;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Cover.js.map