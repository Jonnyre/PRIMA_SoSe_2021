"use strict";
var Endabgabe;
(function (Endabgabe) {
    window.addEventListener("load", init);
    var f = FudgeCore;
    let canvas;
    let root;
    let viewport;
    let avatar;
    let cmpCamera;
    let firstPerson = true;
    let canChangeView = true;
    let camSpeed = -0.2;
    let isLocked = false;
    const jumpForce = 400;
    let canAttack = true;
    let enemies;
    let WEAPON;
    (function (WEAPON) {
        WEAPON[WEAPON["BOW"] = 0] = "BOW";
        WEAPON[WEAPON["SWORD"] = 1] = "SWORD";
    })(WEAPON || (WEAPON = {}));
    let equippedWeapon = WEAPON.SWORD;
    async function init() {
        await f.Project.loadResourcesFromHTML();
        root = f.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];
        f.Physics.settings.debugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Physics.settings.debugDraw = true;
        f.Physics.settings.defaultRestitution = 0.5;
        f.Physics.settings.defaultFriction = 0.8;
        canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        let enemiesJson = await fetch("./Enemies.json");
        enemies = await enemiesJson.json();
        createAvatar();
        createRigidbodies();
        createEnemies();
        f.Physics.adjustTransforms(root, true);
        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        document.addEventListener("mousemove", hndMouse);
        document.addEventListener("click", onPointerDown);
        document.addEventListener("pointerlockchange", pointerLockChange);
        Endabgabe.Hud.start();
        document.addEventListener("keydown", hndKeyDown);
        document.addEventListener("keyup", hndKeyRelease);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start(); //Stard the game loop
    }
    function update() {
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        switchWeapon();
        avatar.move();
        changeCameraView();
        viewport.draw();
    }
    function createAvatar() {
        cmpCamera = new f.ComponentCamera();
        avatar = new Endabgabe.Avatar("avatar", cmpCamera);
        f.AudioManager.default.listenTo(root);
        f.AudioManager.default.listenWith(avatar.getComponent(f.ComponentAudioListener));
        root.appendChild(avatar);
    }
    function createRigidbodies() {
        let level = root.getChildrenByName("level")[0];
        for (let node of level.getChildren())
            node.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
    }
    function hndMouse(_event) {
        avatar.getComponent(f.ComponentRigidbody).rotateBody(f.Vector3.Y(_event.movementX * camSpeed));
    }
    function changeCameraView() {
        if (!f.Keyboard.isPressedOne([f.KEYBOARD_CODE.Q]))
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
            cmpCamera.mtxPivot.set(f.Matrix4x4.TRANSLATION(f.Vector3.Y(0.5)));
        firstPerson = !firstPerson;
        canChangeView = false;
        f.Time.game.setTimer(300, 1, () => canChangeView = true);
    }
    function hndKeyDown(_event) {
        if (_event.code == f.KEYBOARD_CODE.W)
            avatar.forwardMovement = 1;
        if (_event.code == f.KEYBOARD_CODE.A)
            avatar.sideMovement = 1;
        if (_event.code == f.KEYBOARD_CODE.S)
            avatar.forwardMovement = -1;
        if (_event.code == f.KEYBOARD_CODE.D)
            avatar.sideMovement = -1;
        if (_event.code == f.KEYBOARD_CODE.SPACE) {
            if (avatar.isGrounded)
                avatar.getComponent(f.ComponentRigidbody).applyLinearImpulse(new f.Vector3(0, jumpForce, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT)
            avatar.sprint();
    }
    function hndKeyRelease(_event) {
        if (_event.code == f.KEYBOARD_CODE.W)
            avatar.forwardMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.A)
            avatar.sideMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.S)
            avatar.forwardMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.D)
            avatar.sideMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT)
            avatar.walk();
    }
    function switchWeapon() {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ONE])) {
            Endabgabe.gameState.weapon = "Sword";
            equippedWeapon = WEAPON.SWORD;
            let crosshairLeft = document.getElementById("crosshair_left");
            crosshairLeft.classList.remove("bow_left");
            crosshairLeft.classList.add("sword_left");
            let crosshairRight = document.getElementById("crosshair_right");
            crosshairRight.classList.remove("bow_right");
            crosshairRight.classList.add("sword_right");
            let crosshairTop = document.getElementById("crosshair_top");
            crosshairTop.classList.remove("bow_top");
            crosshairTop.classList.add("sword_top");
            let crosshairBottom = document.getElementById("crosshair_bottom");
            crosshairBottom.classList.remove("bow_bottom");
            crosshairBottom.classList.add("sword_bottom");
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.TWO])) {
            Endabgabe.gameState.weapon = "Bow";
            equippedWeapon = WEAPON.BOW;
            let crosshairLeft = document.getElementById("crosshair_left");
            crosshairLeft.classList.remove("sword_left");
            crosshairLeft.classList.add("bow_left");
            let crosshairRight = document.getElementById("crosshair_right");
            crosshairRight.classList.remove("sword_right");
            crosshairRight.classList.add("bow_right");
            let crosshairTop = document.getElementById("crosshair_top");
            crosshairTop.classList.remove("sword_top");
            crosshairTop.classList.add("bow_top");
            let crosshairBottom = document.getElementById("crosshair_bottom");
            crosshairBottom.classList.remove("sword_bottom");
            crosshairBottom.classList.add("bow_bottom");
        }
    }
    function pointerLockChange(_event) {
        if (!document.pointerLockElement)
            isLocked = false;
        else
            isLocked = true;
    }
    function onPointerDown(_event) {
        if (!isLocked) {
            canvas.requestPointerLock();
        }
        else {
            if (!canAttack)
                return;
            switch (equippedWeapon) {
                case WEAPON.BOW:
                    let projectile = new Endabgabe.Projectile("Projectile", avatar.mtxWorld.translation, avatar.mtxWorld.getZ());
                    projectile.getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, hndCollision);
                    root.addChild(projectile);
                    let direction = avatar.mtxWorld.getZ();
                    direction.scale(6);
                    direction.y += 1;
                    projectile.getComponent(f.ComponentRigidbody).applyLinearImpulse(direction);
                    canAttack = false;
                    f.Time.game.setTimer(500, 1, () => canAttack = true);
                    // projectile.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, hndCollision);
                    break;
                case WEAPON.SWORD:
                    let hitInfo = f.Physics.raycast(avatar.getComponent(f.ComponentRigidbody).getPosition(), avatar.mtxWorld.getZ(), 4.5);
                    if (hitInfo.hit) {
                        if (hitInfo.rigidbodyComponent.getContainer().name === "enemie" || hitInfo.rigidbodyComponent.getContainer().name === "boss") {
                            hitInfo.rigidbodyComponent.getContainer().getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life -= 5;
                            console.log(hitInfo.rigidbodyComponent.getContainer().getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life);
                        }
                    }
                    break;
                default:
                    console.log("Schlag");
                    break;
            }
        }
    }
    function createEnemies() {
        let enemiesNode = root.getChildrenByName("enemies")[0];
        for (let enemie of enemiesNode.getChildren()) {
            enemie.addComponent(new Endabgabe.ComponentScriptEnemie());
            enemie.getComponent(Endabgabe.ComponentScriptEnemie).enemyProps = {
                id: enemies[0].id,
                damage: enemies[0].damage,
                life: enemies[0].life,
                bossdamagemulitplier: enemies[0].bossdamagemulitplier,
                bosslifemulitplier: enemies[0].bosslifemulitplier
            };
            enemie.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
            // enemie.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, hndCollision);
        }
    }
    function hndCollision(_event) {
        if (_event.cmpRigidbody.getContainer().name === "boss" || _event.cmpRigidbody.getContainer().name === "enemie") {
            console.log(_event.cmpRigidbody.getContainer().getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life -= 5);
            if (_event.cmpRigidbody.getContainer().getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life <= 0) {
                let enemiesNode = root.getChildrenByName("enemies")[0];
                enemiesNode.removeChild(enemiesNode.getChildrenByName(_event.cmpRigidbody.getContainer().name)[0]);
            }
        }
        if (_event.cmpRigidbody.getContainer().name !== "Avatar") {
            let projectile = _event.target.getContainer();
            projectile.getComponent(f.ComponentRigidbody).physicsType = f.PHYSICS_TYPE.STATIC;
            f.Time.game.setTimer(1000, 1, () => root.removeChild(projectile));
        }
    }
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Main.js.map