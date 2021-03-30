"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class Character extends L02_SpaceInvader.SpaceInvaderObject {
        constructor(_name, _position) {
            super(_name, _position, new f.Vector2(1, 0.4), "white");
            let characterWeapon = new L02_SpaceInvader.SpaceInvaderObject("characterWeapon", new f.Vector2(0, 0.3), new f.Vector2(0.2, 0.2), "white");
            this.addChild(characterWeapon);
        }
    }
    L02_SpaceInvader.Character = Character;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Character.js.map