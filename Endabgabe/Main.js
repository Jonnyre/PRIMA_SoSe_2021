"use strict";
// https://github.com/Oneof300/MazeBall
var Endabgabe;
// https://github.com/Oneof300/MazeBall
(function (Endabgabe) {
    window.addEventListener("load", init);
    var f = FudgeCore;
    let Game;
    (function (Game) {
        Game[Game["PLAY"] = 0] = "PLAY";
        Game[Game["OVER"] = 1] = "OVER";
    })(Game = Endabgabe.Game || (Endabgabe.Game = {}));
    let canvas;
    let viewport;
    let cmpCamera;
    let firstPerson = true;
    let canChangeView = true;
    let camSpeed = -0.2;
    let isLocked = false;
    const jumpForce = 400;
    let canAttack = true;
    let enemies;
    let levelId = 0;
    let WEAPON;
    (function (WEAPON) {
        WEAPON[WEAPON["BOW"] = 0] = "BOW";
        WEAPON[WEAPON["SWORD"] = 1] = "SWORD";
    })(WEAPON || (WEAPON = {}));
    let equippedWeapon = WEAPON.SWORD;
    async function init() {
        let currentLocation = window.location.search;
        levelId = Number(currentLocation.replace("?id=", ""));
        console.log(levelId);
        if (levelId == 0)
            levelId = 1;
        await f.Project.loadResourcesFromHTML();
        Endabgabe.root = f.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];
        removedUnusedLevel();
        f.Physics.initializePhysics();
        // f.Physics.settings.debugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        // f.Physics.settings.debugDraw = true;
        f.Physics.settings.defaultRestitution = 0.5;
        f.Physics.settings.defaultFriction = 0.8;
        canvas = document.querySelector("canvas");
        viewport = new f.Viewport();
        Endabgabe.state = Game.PLAY;
        let enemiesJson = await fetch("./Enemies.json");
        enemies = await enemiesJson.json();
        createAvatar();
        createRigidbodies();
        createEnemies();
        let restartButton = document.getElementById("restartLevel");
        restartButton.addEventListener("click", restartLevel);
        let levelSelectButton = document.getElementById("levelSelection");
        levelSelectButton.addEventListener("click", clickLevelSelect);
        f.Physics.adjustTransforms(Endabgabe.root, true);
        viewport.initialize("InteractiveViewport", Endabgabe.root, cmpCamera, canvas);
        document.addEventListener("mousemove", hndMouse);
        document.addEventListener("click", onPointerDown);
        document.addEventListener("pointerlockchange", pointerLockChange);
        Endabgabe.Hud.start();
        document.addEventListener("keydown", hndKeyDown);
        document.addEventListener("keyup", hndKeyRelease);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        f.Loop.start();
    }
    function update() {
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        if (Endabgabe.state == Game.OVER)
            return;
        switchWeapon();
        Endabgabe.avatar.move();
        changeCameraView();
        viewport.draw();
    }
    function createAvatar() {
        cmpCamera = new f.ComponentCamera();
        Endabgabe.avatar = new Endabgabe.Avatar("avatar", cmpCamera);
        Endabgabe.avatar.camNode.mtxLocal.rotateY(-90);
        Endabgabe.avatar.mtxLocal.translateY(1);
        f.AudioManager.default.listenTo(Endabgabe.root);
        f.AudioManager.default.listenWith(Endabgabe.avatar.getComponent(f.ComponentAudioListener));
        Endabgabe.root.appendChild(Endabgabe.avatar);
    }
    function createRigidbodies() {
        let levelParent = Endabgabe.root.getChildrenByName("level" + levelId)[0];
        let level = levelParent.getChildrenByName("level")[0];
        let floor = level.getChildrenByName("floor")[0];
        for (let row of floor.getChildren()) {
            for (let piece of row.getChildren())
                piece.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
        }
        let walls = level.getChildrenByName("walls")[0];
        for (let wall of walls.getChildren())
            wall.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
    }
    function hndMouse(_event) {
        console.log();
        Endabgabe.avatar.camNode.mtxLocal.rotateY(_event.movementX * camSpeed, true);
        let xRotation = -_event.movementY * camSpeed;
        if (Endabgabe.avatar.camNode.mtxLocal.rotation.x + xRotation > -45 && Endabgabe.avatar.camNode.mtxLocal.rotation.x + xRotation < 45)
            Endabgabe.avatar.camNode.mtxLocal.rotateX(-_event.movementY * camSpeed);
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
            Endabgabe.avatar.sideMovement = 1;
        if (_event.code == f.KEYBOARD_CODE.A)
            Endabgabe.avatar.forwardMovement = 1;
        if (_event.code == f.KEYBOARD_CODE.S)
            Endabgabe.avatar.sideMovement = -1;
        if (_event.code == f.KEYBOARD_CODE.D)
            Endabgabe.avatar.forwardMovement = -1;
        if (_event.code == f.KEYBOARD_CODE.SPACE) {
            if (Endabgabe.avatar.isGrounded)
                Endabgabe.avatar.getComponent(f.ComponentRigidbody).applyLinearImpulse(new f.Vector3(0, jumpForce, 0));
        }
        if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT)
            Endabgabe.avatar.sprint();
    }
    function hndKeyRelease(_event) {
        if (_event.code == f.KEYBOARD_CODE.W)
            Endabgabe.avatar.sideMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.A)
            Endabgabe.avatar.forwardMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.S)
            Endabgabe.avatar.sideMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.D)
            Endabgabe.avatar.forwardMovement = 0;
        if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT)
            Endabgabe.avatar.walk();
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
                    let arrow = new Endabgabe.Arrow("Arrow", Endabgabe.avatar.getComponent(f.ComponentRigidbody).getPosition(), Endabgabe.avatar.camNode.mtxLocal.getZ());
                    arrow.getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, hndCollision);
                    Endabgabe.root.addChild(arrow);
                    let direction = Endabgabe.avatar.camNode.mtxLocal.getZ();
                    direction.scale(4);
                    direction.y += 1;
                    arrow.getComponent(f.ComponentRigidbody).applyLinearImpulse(direction);
                    canAttack = false;
                    f.Time.game.setTimer(500, 1, () => canAttack = true);
                    break;
                case WEAPON.SWORD:
                    let hitInfo = f.Physics.raycast(Endabgabe.avatar.getComponent(f.ComponentRigidbody).getPosition(), Endabgabe.avatar.camNode.mtxWorld.getZ(), 4.5);
                    if (hitInfo.hit) {
                        let objectHit = hitInfo.rigidbodyComponent.getContainer();
                        if (objectHit.name === "enemie" || objectHit.name === "boss") {
                            attackEnemie(objectHit);
                            canAttack = false;
                            f.Time.game.setTimer(500, 1, () => canAttack = true);
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
        let level = Endabgabe.root.getChildrenByName("level" + levelId)[0];
        let enemiesNode = level.getChildrenByName("enemies")[0];
        for (let enemie of enemiesNode.getChildren()) {
            let enemieComponent = new Endabgabe.ComponentScriptEnemie();
            enemie.addComponent(enemieComponent);
            if (enemie.name === "boss") {
                enemieComponent.enemyProps = {
                    id: enemies[0].id,
                    damage: enemies[0].damage * enemies[0].bossdamagemulitplier,
                    life: enemies[0].life * enemies[0].bosslifemulitplier,
                    bossdamagemulitplier: enemies[0].bossdamagemulitplier,
                    bosslifemulitplier: enemies[0].bosslifemulitplier,
                    xp: enemies[0].xp
                };
                Endabgabe.gameState.bosslife = enemies[0].life * enemies[0].bosslifemulitplier;
                let progress = document.getElementById("bosslife");
                progress.max = enemies[0].life * enemies[0].bosslifemulitplier;
            }
            else
                enemieComponent.enemyProps = {
                    id: enemies[0].id,
                    damage: enemies[0].damage,
                    life: enemies[0].life,
                    bossdamagemulitplier: enemies[0].bossdamagemulitplier,
                    bosslifemulitplier: enemies[0].bosslifemulitplier,
                    xp: enemies[0].xp
                };
            enemie.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
        }
    }
    function hndCollision(_event) {
        let objectHit = _event.cmpRigidbody.getContainer();
        if (objectHit.name === "boss" || objectHit.name === "enemie")
            attackEnemie(objectHit);
        if (objectHit.name !== "Avatar") {
            let projectile = _event.target.getContainer();
            projectile.getComponent(f.ComponentRigidbody).physicsType = f.PHYSICS_TYPE.STATIC;
            f.Time.game.setTimer(1000, 1, () => {
                Endabgabe.root.removeChild(projectile);
                if (projectile.getComponent(f.ComponentRigidbody) != undefined)
                    projectile.removeComponent(projectile.getComponent(f.ComponentRigidbody));
                return;
            });
        }
    }
    function attackEnemie(_objectHit) {
        _objectHit.getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life -= 5;
        if (_objectHit.name == "boss")
            Endabgabe.gameState.bosslife = Number(_objectHit.getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life);
        if (_objectHit.getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.life <= 0) {
            let level = Endabgabe.root.getChildrenByName("level" + levelId)[0];
            let enemiesNode = level.getChildrenByName("enemies")[0];
            enemiesNode.removeChild(_objectHit);
            _objectHit.removeComponent(_objectHit.getComponent(f.ComponentRigidbody));
            Endabgabe.avatar.xp += _objectHit.getComponent(Endabgabe.ComponentScriptEnemie).enemyProps.xp;
            if (enemiesNode.nChildren == 0)
                console.log("win");
        }
    }
    function gameover() {
        Endabgabe.state = Game.OVER;
        document.exitPointerLock();
        let gameOverDiv = document.getElementById("gameover");
        gameOverDiv.style.display = "flex";
    }
    Endabgabe.gameover = gameover;
    async function restartLevel() {
        let gameOverDiv = document.getElementById("gameover");
        gameOverDiv.style.display = "none";
        await init();
    }
    function clickLevelSelect() {
        window.location.href = "./LevelSelect/LevelSelect.html";
    }
    function removedUnusedLevel() {
        for (let currentLevel = 0; currentLevel < 6; currentLevel++) {
            if (currentLevel != levelId) {
                let level = Endabgabe.root.getChildrenByName("level" + currentLevel)[0];
                Endabgabe.root.removeChild(level);
            }
        }
    }
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Main.js.map