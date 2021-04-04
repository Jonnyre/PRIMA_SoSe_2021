"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class SpaceInvaderObject extends f.Node {
        constructor(_name, _position, _size, _texture) {
            super(_name);
            this.rect = new f.Rectangle(_position.x, _position.y, _size.x, _size.y, f.ORIGIN2D.CENTER);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            let cmpQuad = new f.ComponentMesh(SpaceInvaderObject.meshQuad);
            cmpQuad.mtxPivot.scale(_size.toVector3(0));
            this.addComponent(cmpQuad);
            if (_texture === "invader") {
                this.addComponent(new f.ComponentMaterial(SpaceInvaderObject.mtrInvader));
            }
            else {
                this.addComponent(new f.ComponentMaterial(SpaceInvaderObject.material));
            }
        }
        checkCollision(_target) {
            let intersection = this.rect.getIntersection(_target.rect);
            if (intersection == null) {
                return false;
            }
            return true;
        }
    }
    SpaceInvaderObject.meshQuad = new f.MeshQuad();
    SpaceInvaderObject.material = new f.Material("White", f.ShaderUniColor, new f.CoatColored());
    SpaceInvaderObject.textureInvader = new f.TextureImage("./Assets/invader.png");
    SpaceInvaderObject.mtrInvader = new f.Material("Invader", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), SpaceInvaderObject.textureInvader));
    L02_SpaceInvader.SpaceInvaderObject = SpaceInvaderObject;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=SpaceInvaderObject.js.map