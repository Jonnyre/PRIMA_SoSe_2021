"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class Cover extends f.Node {
        constructor(_name, _position) {
            super(_name);
            this.stripeSize = new f.Vector2(0.3, 0.3);
            this.coverSize = 1.5;
            this.stripeRowCount = 5;
            this.xPosStripe = this.coverSize / this.stripeRowCount;
            let stripePosition = new f.Vector2(_position.x, _position.y);
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    let stripe = new L02_SpaceInvader.SpaceInvaderObject("stripe" + i * 5 + j, new f.Vector2(stripePosition.x, stripePosition.y), this.stripeSize);
                    this.addChild(stripe);
                    stripePosition.x += this.xPosStripe;
                }
                stripePosition.x = _position.x;
                stripePosition.y -= this.xPosStripe;
            }
        }
    }
    L02_SpaceInvader.Cover = Cover;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Cover.js.map