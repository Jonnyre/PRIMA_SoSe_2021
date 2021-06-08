namespace Endabgabe {
    import f = FudgeCore;

    export class Projectile extends f.Node {

        private static textureProjectile: f.TextureImage = new f.TextureImage("./Assets/Arrow.png");
        private static mtrProjectile: f.Material = new f.Material("Arrow", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), Projectile.textureProjectile));

        constructor(_name: string, _characterPos: f.Vector3, _characterZ: f.Vector3) {
            super(_name);
            let meshCube: f.MeshCube = new f.MeshCube();
            let direction: f.Vector3 = _characterZ;
            direction.normalize(2);
            let position: f.Vector3 = _characterPos;
            position.add(direction);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(position)));
            this.getComponent(f.ComponentTransform).mtxLocal.scale(new f.Vector3(1, 0.1, 0.1));
            let cmpQuad: f.ComponentMesh = new f.ComponentMesh(meshCube);
            this.addComponent(cmpQuad);
            this.addComponent(new f.ComponentMaterial(Projectile.mtrProjectile));

            this.addComponent(new f.ComponentRigidbody(0.2, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
            f.Physics.adjustTransforms(this, true);
        }
    }
}