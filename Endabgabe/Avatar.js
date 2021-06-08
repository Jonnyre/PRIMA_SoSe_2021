"use strict";
var Endabgabe;
(function (Endabgabe) {
    var f = FudgeCore;
    class Avatar extends f.Node {
        constructor(_name, _cmpCamera) {
            super(_name);
            this.movementSpeed = 5;
            this.forwardMovement = 0;
            this.sideMovement = 0;
            this.defaultMovementSpeed = 5;
            let cmpTransform = new f.ComponentTransform(f.Matrix4x4.IDENTITY());
            // cmpTransform.mtxLocal.scale(new f.Vector3(1, 1, 1));
            this.addComponent(cmpTransform);
            let avatarBody = new f.ComponentRigidbody(75, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CAPSULE, f.PHYSICS_GROUP.DEFAULT);
            avatarBody.friction = 0.01;
            avatarBody.restitution = 0;
            avatarBody.rotationInfluenceFactor = f.Vector3.ZERO();
            let cmpAudio = new f.ComponentAudio();
            this.addComponent(_cmpCamera);
            this.addComponent(cmpAudio);
            this.addComponent(avatarBody);
        }
        move() {
            this.checkIfGrounded();
            let avatarForward = this.mtxWorld.getZ();
            let avatarSideward = this.mtxWorld.getX();
            avatarSideward.normalize();
            avatarForward.normalize();
            let movementVel = new f.Vector3();
            movementVel.z = (avatarForward.z * this.forwardMovement + avatarSideward.z * this.sideMovement) * this.movementSpeed;
            movementVel.y = this.getComponent(f.ComponentRigidbody).getVelocity().y;
            movementVel.x = (avatarForward.x * this.forwardMovement + avatarSideward.x * this.sideMovement) * this.movementSpeed;
            this.getComponent(f.ComponentRigidbody).setVelocity(movementVel);
        }
        checkIfGrounded() {
            let hitInfo;
            hitInfo = f.Physics.raycast(this.getComponent(f.ComponentRigidbody).getPosition(), new f.Vector3(0, -1, 0), 1.1);
            this.isGrounded = hitInfo.hit;
        }
        sprint() {
            if (this.movementSpeed != 8)
                this.movementSpeed = 8;
        }
        walk() {
            this.movementSpeed = this.defaultMovementSpeed;
        }
    }
    Endabgabe.Avatar = Avatar;
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Avatar.js.map