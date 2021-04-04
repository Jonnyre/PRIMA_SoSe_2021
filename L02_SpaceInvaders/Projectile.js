"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class Projectile extends L02_SpaceInvader.SpaceInvaderObject {
        constructor(_name, _position) {
            super(_name, _position, new f.Vector2(0.1, 0.7));
            this.velocity = 10;
        }
        move() {
            let timeSinceLastFrame = f.Loop.timeFrameReal / 1000;
            this.mtxLocal.translateY(timeSinceLastFrame * this.velocity);
            this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
        }
    }
    L02_SpaceInvader.Projectile = Projectile;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Projectile.js.map