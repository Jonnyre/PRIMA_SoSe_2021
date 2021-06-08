"use strict";
var Endabgabe;
(function (Endabgabe) {
    var f = FudgeCore;
    class Projectile extends f.Node {
        constructor(_name, _characterPos, _characterZ) {
            super(_name);
            let meshCube = new f.MeshCube();
            let direction = _characterZ;
            direction.normalize(2);
            let position = _characterPos;
            position.add(direction);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(position)));
            this.getComponent(f.ComponentTransform).mtxLocal.scale(new f.Vector3(1, 0.1, 0.1));
            let cmpQuad = new f.ComponentMesh(meshCube);
            this.addComponent(cmpQuad);
            this.addComponent(new f.ComponentMaterial(Projectile.mtrProjectile));
            this.addComponent(new f.ComponentRigidbody(0.2, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
            f.Physics.adjustTransforms(this, true);
        }
    }
    Projectile.textureProjectile = new f.TextureImage("./Assets/Arrow.png");
    Projectile.mtrProjectile = new f.Material("Arrow", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), Projectile.textureProjectile));
    Endabgabe.Projectile = Projectile;
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Projectile.js.map