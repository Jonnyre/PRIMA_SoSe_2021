"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    class SpaceInvaderObject extends f.Node {
        constructor(_name, _position, _size, _material) {
            super(_name);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position.toVector3(0))));
            let cmpQuad = new f.ComponentMesh(SpaceInvaderObject.meshQuad);
            cmpQuad.mtxPivot.scale(_size.toVector3(0));
            this.addComponent(cmpQuad);
            if (_material == "white") {
                let cmpMaterial = new f.ComponentMaterial(SpaceInvaderObject.mtrSolidWhite);
                this.addComponent(cmpMaterial);
            }
        }
    }
    SpaceInvaderObject.meshQuad = new f.MeshQuad();
    SpaceInvaderObject.mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("WHITE")));
    L02_SpaceInvader.SpaceInvaderObject = SpaceInvaderObject;
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=SpaceInvaderObject.js.map