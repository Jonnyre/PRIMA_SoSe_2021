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
    let playerItem;
    let hasItem = false;
    let firstPerson = true;
    let canChangeView = true;
    let forwardMovement = 0;
    let sideMovement = 0;
    let movementSpeed = 5;
    let camSpeed = -0.2;
    let isGrounded;
    const jumpForce = 400;
    async function init() {
        await f.Project.loadResourcesFromHTML();
        root = f.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];
        f.Physics.settings.debugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Physics.settings.debugDraw = true;
        f.Physics.settings.defaultRestitution = 0.5;
        f.Physics.settings.defaultFriction = 0.8;
        cmpCamera = new f.ComponentCamera();
        let canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        createPlayer();
        createRigidbodies();
        f.Physics.adjustTransforms(root, true);
        f.Physics.settings.debugDraw = true;
        canvas.addEventListener("mousemove", hndMouse);
        canvas.addEventListener("click", canvas.requestPointerLock);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); //Stard the game loop
        document.addEventListener("keydown", hndKeyDown);
        document.addEventListener("keyup", hndKeyRelease);
    }
    function update() {
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        movePlayer();
        checkIfGrounded();
        hndItem();
        changeCameraView();
        viewport.draw();
    }
    function createPlayer() {
        cmpPlayer = new f.ComponentRigidbody(75, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CAPSULE, f.PHYSICS_GROUP.DEFAULT);
        cmpPlayer.friction = 0.01;
        cmpPlayer.restitution = 0;
        cmpPlayer.rotationInfluenceFactor = f.Vector3.ZERO();
        player = new f.Node("Player");
        let cmpAudio = new f.ComponentAudio();
        player.addComponent(new f.ComponentTransform());
        f.AudioManager.default.listenTo(root);
        f.AudioManager.default.listenWith(player.getComponent(f.ComponentAudioListener));
        player.mtxLocal.translateY(5);
        player.addComponent(cmpPlayer);
        player.addComponent(cmpCamera);
        player.addComponent(cmpAudio);
        playerItem = new f.Node("PlayerItem");
        player.addChild(playerItem);
        root.appendChild(player);
    }
    function createRigidbodies() {
        let level = root.getChildrenByName("level")[0];
        for (let node of level.getChildren()) {
            if (node.name === "cyclinder") {
                node.addComponent(new f.ComponentRigidbody(2, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
                node.addComponent(new L04_Editor.ComponentScriptMove());
            }
            else if (node.name === "board") {
                node.addComponent(new f.ComponentRigidbody(2, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
                node.addComponent(new L04_Editor.ComponentScriptJump());
            }
            else
                node.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
        }
        ball = root.getChildrenByName("ball")[0];
        let ballAudio = new f.Audio("./Audio/AirHorn.mp3");
        let cmpAudio = new f.ComponentAudio(ballAudio);
        cmpAudio.volume = 0.1;
        ball.addComponent(new L04_Editor.ComponentScriptAudio());
        ball.addComponent(cmpAudio);
        ball.addComponent(new f.ComponentRigidbody(5, f.PHYSICS_TYPE.DYNAMIC, f.COLLIDER_TYPE.SPHERE, f.PHYSICS_GROUP.DEFAULT));
        ball.getComponent(f.ComponentRigidbody).restitution = 1.5;
    }
    function movePlayer() {
        let playerForward = player.mtxWorld.getZ();
        let playerSideward = player.mtxWorld.getX();
        playerSideward.normalize();
        playerForward.normalize();
        let movementVel = new f.Vector3();
        movementVel.z = (playerForward.z * forwardMovement + playerSideward.z * sideMovement) * movementSpeed;
        movementVel.y = cmpPlayer.getVelocity().y;
        movementVel.x = (playerForward.x * forwardMovement + playerSideward.x * sideMovement) * movementSpeed;
        cmpPlayer.setVelocity(movementVel);
    }
    function hndItem() {
        if (??.Keyboard.isPressedOne([??.KEYBOARD_CODE.R]))
            releaseItem();
        if (??.Keyboard.isPressedOne([??.KEYBOARD_CODE.E]))
            pickItem();
    }
    function releaseItem() {
        if (!hasItem)
            return;
        let item = playerItem.getChild(0);
        let itemRigidbody = item.getComponent(f.ComponentRigidbody);
        root.addChild(item);
        itemRigidbody.applyAngularImpulse(f.Vector3.Z(10));
        itemRigidbody.setVelocity(f.Vector3.ZERO());
        itemRigidbody.physicsType = f.PHYSICS_TYPE.DYNAMIC;
        hasItem = false;
    }
    function pickItem() {
        if (hasItem)
            return;
        let hitInfo = f.Physics.raycast(cmpPlayer.getPosition(), player.mtxWorld.getZ(), 2.5);
        if (hitInfo.hit) {
            if (hitInfo.rigidbodyComponent.getContainer() === ball) {
                ball.getComponent(f.ComponentRigidbody).physicsType = f.PHYSICS_TYPE.KINEMATIC;
                playerItem.addChild(ball);
                ball.mtxLocal.set(f.Matrix4x4.TRANSLATION(f.Vector3.Z(2)));
                hasItem = true;
            }
        }
    }
    function hndMouse(_event) {
        cmpPlayer.rotateBody(??.Vector3.Y(_event.movementX * camSpeed));
    }
    function changeCameraView() {
        if (!??.Keyboard.isPressedOne([??.KEYBOARD_CODE.Q]))
            return;
        if (!canChangeView)
            return;
        if (firstPerson) {
            cmpCamera.mtxPivot.translateY(1);
            cmpCamera.mtxPivot.rotateX(15);
            cmpCamera.mtxPivot.rotateY(0);
            cmpCamera.mtxPivot.translateZ(-6);
        }
        else
            cmpCamera.mtxPivot.set(f.Matrix4x4.IDENTITY());
        firstPerson = !firstPerson;
        canChangeView = false;
        f.Time.game.setTimer(300, 1, () => canChangeView = true);
    }
    function hndKeyDown(_event) {
        if (_event.code == f.KEYBOARD_CODE.W) {
            forwardMovement = 1;
        }
        if (_event.code == f.KEYBOARD_CODE.A) {
            sideMovement = 1;
        }
        if (_event.code == f.KEYBOARD_CODE.S) {
            forwardMovement = -1;
        }
        if (_event.code == f.KEYBOARD_CODE.D) {
            sideMovement = -1;
        }
        if (_event.code == f.KEYBOARD_CODE.SPACE) {
            if (isGrounded)
                cmpPlayer.applyLinearImpulse(new f.Vector3(0, jumpForce, 0));
        }
    }
    function checkIfGrounded() {
        let hitInfo;
        hitInfo = f.Physics.raycast(cmpPlayer.getPosition(), new f.Vector3(0, -1, 0), 1.1);
        isGrounded = hitInfo.hit;
    }
    function hndKeyRelease(_event) {
        if (_event.code == f.KEYBOARD_CODE.W) {
            forwardMovement = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.A) {
            sideMovement = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.S) {
            forwardMovement = 0;
        }
        if (_event.code == f.KEYBOARD_CODE.D) {
            sideMovement = 0;
        }
    }
})(L04_Editor || (L04_Editor = {}));
//# sourceMappingURL=Main.js.map