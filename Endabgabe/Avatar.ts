namespace Endabgabe {
    import f = FudgeCore;

    export class Avatar extends f.Node {
        public movementSpeed: number = 5;
        public forwardMovement: number = 0;
        public sideMovement: number = 0;
        public isGrounded: boolean;
        public isInRange: boolean;

        private defaultMovementSpeed: number = 5;
        constructor(_name: string, _cmpCamera: f.ComponentCamera) {
            super(_name);
            let cmpTransform: f.ComponentTransform = new f.ComponentTransform(f.Matrix4x4.IDENTITY());
            // cmpTransform.mtxLocal.scale(new f.Vector3(1, 1, 1));
            this.addComponent(cmpTransform);
            let avatarBody: f.ComponentRigidbody = new f.ComponentRigidbody(75, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CAPSULE, f.PHYSICS_GROUP.DEFAULT);
            avatarBody.friction = 0.01;
            avatarBody.restitution = 0;
            avatarBody.rotationInfluenceFactor = f.Vector3.ZERO();

            let cmpAudio: f.ComponentAudio = new f.ComponentAudio();
            
            this.addComponent(_cmpCamera);
            this.addComponent(cmpAudio);
            this.addComponent(avatarBody);
        }

        public move(): void {
            this.checkIfGrounded();
            let avatarForward: f.Vector3 = this.mtxWorld.getZ();
            let avatarSideward: f.Vector3 = this.mtxWorld.getX();
            avatarSideward.normalize();
            avatarForward.normalize();
            let movementVel: f.Vector3 = new f.Vector3();
            movementVel.z = (avatarForward.z * this.forwardMovement + avatarSideward.z * this.sideMovement) * this.movementSpeed;
            movementVel.y = this.getComponent(f.ComponentRigidbody).getVelocity().y;
            movementVel.x = (avatarForward.x * this.forwardMovement + avatarSideward.x * this.sideMovement) * this.movementSpeed;
            this.getComponent(f.ComponentRigidbody).setVelocity(movementVel);
        }

        public checkIfGrounded(): void {
            let hitInfo: f.RayHitInfo;
            hitInfo = f.Physics.raycast(this.getComponent(f.ComponentRigidbody).getPosition(), new f.Vector3(0, -1, 0), 1.1);
            this.isGrounded = hitInfo.hit;
        }

        public sprint(): void {
            if (this.movementSpeed != 8) this.movementSpeed = 8;
        }

        public walk(): void {
            this.movementSpeed = this.defaultMovementSpeed;
        }
    }
}