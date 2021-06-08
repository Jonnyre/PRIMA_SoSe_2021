namespace Endabgabe {
    window.addEventListener("load", init);
    import f = FudgeCore;

    export interface IEnemie {
        id: number;
        life: number;
        damage: number;
        bosslifemulitplier: number;
        bossdamagemulitplier: number;
    }
    let canvas: HTMLCanvasElement;
    let root: f.Graph;
    let viewport: f.Viewport;
    let avatar: Avatar;
    let cmpCamera: f.ComponentCamera;

    let firstPerson: boolean = true;
    let canChangeView: boolean = true;

    let camSpeed: number = -0.2;
    let isLocked: boolean = false;
    const jumpForce: number = 400;
    let canAttack: boolean = true;
    let enemies: IEnemie[];

    enum WEAPON {
        BOW = 0,
        SWORD = 1
    }
    let equippedWeapon: WEAPON = WEAPON.SWORD;

    async function init(): Promise<void> {
        await f.Project.loadResourcesFromHTML();
        root = <f.Graph>f.Project.resources["Graph|2021-04-27T14:37:42.239Z|64317"];

        f.Physics.settings.debugMode = f.PHYSICS_DEBUGMODE.COLLIDERS;
        f.Physics.settings.debugDraw = true;
        f.Physics.settings.defaultRestitution = 0.5;
        f.Physics.settings.defaultFriction = 0.8;
        canvas = document.querySelector("canvas");
        viewport = new f.Viewport();

        let enemiesJson: Response = await fetch("./Enemies.json");
        enemies = await enemiesJson.json();
        createAvatar();
        createRigidbodies();
        createEnemies();

        f.Physics.adjustTransforms(root, true);

        viewport.initialize("InteractiveViewport", root, cmpCamera, canvas);
        document.addEventListener("mousemove", hndMouse);
        document.addEventListener("click", onPointerDown);
        document.addEventListener("pointerlockchange", pointerLockChange);

        Hud.start();

        document.addEventListener("keydown", hndKeyDown);
        document.addEventListener("keyup", hndKeyRelease);

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(); //Stard the game loop
    }

    function update(): void {
        f.Physics.world.simulate(f.Loop.timeFrameReal / 1000);
        switchWeapon();
        avatar.move();
        changeCameraView();
        viewport.draw();
    }

    function createAvatar(): void {
        cmpCamera = new f.ComponentCamera();
        avatar = new Avatar("avatar", cmpCamera);
        f.AudioManager.default.listenTo(root);
        f.AudioManager.default.listenWith(avatar.getComponent(f.ComponentAudioListener));
        root.appendChild(avatar);
    }

    function createRigidbodies(): void {
        let level: f.Node = root.getChildrenByName("level")[0];

        for (let node of level.getChildren())
            node.addComponent(new f.ComponentRigidbody(0, f.PHYSICS_TYPE.STATIC, f.COLLIDER_TYPE.CUBE, f.PHYSICS_GROUP.DEFAULT));
    }

    function hndMouse(_event: MouseEvent): void {
        avatar.getComponent(f.ComponentRigidbody).rotateBody(f.Vector3.Y(_event.movementX * camSpeed));
    }

    function changeCameraView(): void {
        if (!f.Keyboard.isPressedOne([f.KEYBOARD_CODE.Q])) return;

        if (!canChangeView) return;

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

    function hndKeyDown(_event: KeyboardEvent): void {
        if (_event.code == f.KEYBOARD_CODE.W)
            avatar.forwardMovement = 1;

        if (_event.code == f.KEYBOARD_CODE.A)
            avatar.sideMovement = 1;

        if (_event.code == f.KEYBOARD_CODE.S)
            avatar.forwardMovement = -1;

        if (_event.code == f.KEYBOARD_CODE.D)
            avatar.sideMovement = -1;

        if (_event.code == f.KEYBOARD_CODE.SPACE) {
            if (avatar.isGrounded) avatar.getComponent(f.ComponentRigidbody).applyLinearImpulse(new f.Vector3(0, jumpForce, 0));
        }

        if (_event.code == f.KEYBOARD_CODE.SHIFT_LEFT)
            avatar.sprint();
    }

    function hndKeyRelease(_event: KeyboardEvent): void {
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

    function switchWeapon(): void {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ONE])) {
            gameState.weapon = "Sword";
            equippedWeapon = WEAPON.SWORD;

            let crosshairLeft: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_left");
            crosshairLeft.classList.remove("bow_left");
            crosshairLeft.classList.add("sword_left");

            let crosshairRight: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_right");
            crosshairRight.classList.remove("bow_right");
            crosshairRight.classList.add("sword_right");

            let crosshairTop: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_top");
            crosshairTop.classList.remove("bow_top");
            crosshairTop.classList.add("sword_top");

            let crosshairBottom: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_bottom");
            crosshairBottom.classList.remove("bow_bottom");
            crosshairBottom.classList.add("sword_bottom");
        }


        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.TWO])) {
            gameState.weapon = "Bow";
            equippedWeapon = WEAPON.BOW;
            let crosshairLeft: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_left");
            crosshairLeft.classList.remove("sword_left");
            crosshairLeft.classList.add("bow_left");

            let crosshairRight: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_right");
            crosshairRight.classList.remove("sword_right");
            crosshairRight.classList.add("bow_right");

            let crosshairTop: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_top");
            crosshairTop.classList.remove("sword_top");
            crosshairTop.classList.add("bow_top");

            let crosshairBottom: HTMLDivElement = <HTMLDivElement>document.getElementById("crosshair_bottom");
            crosshairBottom.classList.remove("sword_bottom");
            crosshairBottom.classList.add("bow_bottom");
        }
    }

    function pointerLockChange(_event: Event): void {
        if (!document.pointerLockElement)
            isLocked = false;
        else
            isLocked = true;
    }

    function onPointerDown(_event: MouseEvent): void {
        if (!isLocked) {
            canvas.requestPointerLock();
        } else {
            if (!canAttack) return;
            switch (equippedWeapon) {
                case WEAPON.BOW:
                    let projectile: Projectile = new Projectile("Projectile", avatar.mtxWorld.translation, avatar.mtxWorld.getZ());
                    projectile.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, hndCollision);
                    root.addChild(projectile);
                    let direction: f.Vector3 = avatar.mtxWorld.getZ();
                    direction.scale(6);
                    direction.y += 1;
                    projectile.getComponent(f.ComponentRigidbody).applyLinearImpulse(direction);
                    canAttack = false;
                    f.Time.game.setTimer(500, 1, () => canAttack = true);
                    // projectile.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, hndCollision);
                    break;
                case WEAPON.SWORD:
                    let hitInfo: f.RayHitInfo = f.Physics.raycast(avatar.getComponent(f.ComponentRigidbody).getPosition(), avatar.mtxWorld.getZ(), 4.5);
                    if (hitInfo.hit) {
                        if (hitInfo.rigidbodyComponent.getContainer().name === "enemie" || hitInfo.rigidbodyComponent.getContainer().name === "boss") {
                            hitInfo.rigidbodyComponent.getContainer().getComponent(ComponentScriptEnemie).enemyProps.life -= 5;
                            console.log(hitInfo.rigidbodyComponent.getContainer().getComponent(ComponentScriptEnemie).enemyProps.life);
                        }
                    }
                    break;
                default:
                    console.log("Schlag");
                    break;
            }
        }
    }

    function createEnemies(): void {
        let enemiesNode: f.Node = root.getChildrenByName("enemies")[0];

        for (let enemie of enemiesNode.getChildren()) {
            enemie.addComponent(new ComponentScriptEnemie());
            enemie.getComponent(ComponentScriptEnemie).enemyProps = {
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

    function hndCollision(_event: f.EventPhysics): void {
        if (_event.cmpRigidbody.getContainer().name === "boss" || _event.cmpRigidbody.getContainer().name === "enemie") {
            console.log(_event.cmpRigidbody.getContainer().getComponent(ComponentScriptEnemie).enemyProps.life -= 5);

            if (_event.cmpRigidbody.getContainer().getComponent(ComponentScriptEnemie).enemyProps.life <= 0) {
                let enemiesNode: f.Node = root.getChildrenByName("enemies")[0];
                enemiesNode.removeChild(enemiesNode.getChildrenByName(_event.cmpRigidbody.getContainer().name)[0]);
            }
        }

        if (_event.cmpRigidbody.getContainer().name !== "Avatar") {
            let projectile: Projectile = (<f.ComponentRigidbody>_event.target).getContainer();
            projectile.getComponent(f.ComponentRigidbody).physicsType = f.PHYSICS_TYPE.STATIC;
            f.Time.game.setTimer(1000, 1, () => root.removeChild(projectile));
        }
    }
}
