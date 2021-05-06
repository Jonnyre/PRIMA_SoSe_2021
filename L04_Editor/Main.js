"use strict";
var L04_Editor;
(function (L04_Editor) {
    window.addEventListener("load", init);
    var f = FudgeCore;
    // import fAid = FudgeAid;
    let root;
    let cmpPlayer;
    let viewport;
    let player;
    let cmpCamera;
    let ball;
    const speed = 5;
    const rotate = 2.5;
    const pickReleaseCooldown = 500;
    let forward;
    let playerItem;
    let canPickItem = true;
    let hasItem = false;
    async function init() {
        await f.Project.loadResourcesFromHTML();
        root = f.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];
        f.Physics.world.setSolverIterations(1000);
        f.Physics.settings.defaultRestitution = 0.3;
        f.Physics.settings.defaultFriction = 0.8;
        cmpCamera = new f.ComponentCamera();
        // cmpCamera.mtxPivot.translate(ƒ.Vector3.ONE(3));
        // cmpCamera.mtxPivot.lookAt(f.Vector3.ZERO());
        cmpCamera.mtxPivot.translateY(1);
        cmpCamera.mtxPivot.rotateX(15);
        cmpCamera.mtxPivot.rotateY(0);
        cmpCamera.mtxPivot.translateZ(-6);
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        createPlayer();
        createRigidbodies();
        f.Physics.start(root);
        f.Physics.settings.debugDraw = true;
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); //Stard the game loop
    }
    function update() {
        movePlayer();
        hndItem();
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        viewport.draw();
    }
    function createPlayer() {
        cmpPlayer = new f.ComponentRigidbody(75, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CAPSULE, f.PHYSICS_GROUP.DEFAULT);
        cmpPlayer.friction = 1;
        cmpPlayer.restitution = 0.5;
        cmpPlayer.rotationInfluenceFactor = f.Vector3.ZERO();
        player = new f.Node("Player");
        player.addComponent(new f.ComponentTransform());
        player.mtxLocal.translateY(5);
        player.addComponent(cmpPlayer);
        player.addComponent(cmpCamera);
        playerItem = new f.Node("PlayerItem");
        player.addChild(playerItem);
        root.appendChild(player);
    }
    function createRigidbodies() {
        let level = root.getChildrenByName("level")[0];
        for (let node of level.getChildren()) {
            // node.mtxLocal.scaling = node.getComponent(f.ComponentMesh).mtxPivot.scaling;
            // node.getComponent(f.ComponentMesh).mtxPivot.scaling = f.Vector3.ONE();
            node.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
        }
        ball = root.getChildrenByName("ball")[0];
        // ball.mtxLocal.scaling = ball.getComponent(f.ComponentMesh).mtxPivot.scaling;
        // ball.getComponent(f.ComponentMesh).mtxPivot.scaling = f.Vector3.ONE();
        ball.addComponent(new f.ComponentRigidbody(1, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
        ball.getComponent(f.ComponentRigidbody).restitution = 2.5;
    }
    function movePlayer() {
        forward = player.mtxWorld.getZ();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W, ƒ.KEYBOARD_CODE.ARROW_UP]))
            cmpPlayer.setVelocity(ƒ.Vector3.SCALE(forward, speed));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S, ƒ.KEYBOARD_CODE.ARROW_DOWN]))
            cmpPlayer.setVelocity(ƒ.Vector3.SCALE(forward, -speed));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT]))
            cmpPlayer.rotateBody(ƒ.Vector3.Y(rotate));
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT]))
            cmpPlayer.rotateBody(ƒ.Vector3.Y(-rotate));
        // cmpCamera.mtxPivot = player.mtxLocal;
    }
    function hndItem() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.E])) {
            if (hasItem) {
                releaseItem();
                return;
            }
            if (!canPickItem)
                return;
            pickItem();
            f.Time.game.setTimer(pickReleaseCooldown, 1, () => canPickItem = true);
        }
    }
    function releaseItem() {
        let item = playerItem.getChild(0);
        playerItem.removeChild(item);
        root.addChild(item);
        ball.getComponent(f.ComponentRigidbody).physicsType = f.PHYSICS_TYPE.DYNAMIC;
        hasItem = false;
        canPickItem = false;
        f.Time.game.setTimer(pickReleaseCooldown, 1, () => canPickItem = true);
    }
    function pickItem() {
        let hitInfo = f.Physics.raycast(cmpPlayer.getPosition(), player.mtxWorld.getZ(), 2.5);
        if (hitInfo.hit) {
            canPickItem = false;
            f.Time.game.setTimer(pickReleaseCooldown, 1, () => canPickItem = true);
            if (hitInfo.rigidbodyComponent.getContainer() === ball) {
                ball.getComponent(f.ComponentRigidbody).physicsType = f.PHYSICS_TYPE.KINEMATIC;
                playerItem.addChild(ball);
                ball.mtxLocal.set(f.Matrix4x4.TRANSLATION(f.Vector3.Z(2)));
                f.Time.game.setTimer(pickReleaseCooldown, 1, () => hasItem = true);
            }
        }
    }
})(L04_Editor || (L04_Editor = {}));
//# sourceMappingURL=Main.js.map