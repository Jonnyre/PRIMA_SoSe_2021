"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let root = new f.Node("root");
    let viewport = new f.Viewport();
    let character;
    let projectiles;
    let covers;
    let invaders;
    let walls;
    let attackCooldownCounter = 0;
    const xStartPosition = -8;
    const yInvaderStart = 11;
    const projectileOffset = 1;
    function init(_event) {
        const canvas = document.querySelector("canvas");
        window.addEventListener("keydown", hndKeyDown);
        createCharacter();
        createWalls();
        createInvaders();
        createCovers();
        projectiles = new f.Node("Projectiles");
        root.addChild(projectiles);
        let motherShip = new L02_SpaceInvader.MotherShip("MotherShip", new f.Vector2(3, 12.25));
        root.addChild(motherShip);
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(20);
        cmpCamera.mtxPivot.translateY(6);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        viewport.draw();
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        moveCharacter();
        attackCooldownCounter += f.Loop.timeFrameGame / 1000;
        checkProjectileCollision();
        for (let projectile of projectiles.getChildren()) {
            projectile.move();
        }
        viewport.draw();
    }
    function moveCharacter() {
        let oldCharacterPos = character.mtxLocal.translation;
        let oldCharacterRectX = character.rect.position.x;
        let offset = (character.speed * f.Loop.timeFrameReal) / 1000;
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])) {
            character.mtxLocal.translateX(-offset);
            character.setRectPosition();
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])) {
            character.mtxLocal.translateX(+offset);
            character.setRectPosition();
        }
        if (character.checkCollision(walls.getChildrenByName("wallLeft")[0]) ||
            character.checkCollision(walls.getChildrenByName("wallRight")[0])) {
            character.mtxLocal.translation = oldCharacterPos;
            character.rect.position.x = oldCharacterRectX;
        }
    }
    function checkProjectileCollision() {
        for (let projectile of projectiles.getChildren()) {
            for (let cover of covers.getChildren()) {
                for (let stripe of cover.getChildren()) {
                    if (projectile.checkCollision(stripe)) {
                        projectiles.removeChild(projectile);
                        cover.removeChild(stripe);
                    }
                }
            }
            for (let invader of invaders.getChildren()) {
                if (projectile.checkCollision(invader)) {
                    projectiles.removeChild(projectile);
                    invaders.removeChild(invader);
                }
            }
            if (projectile.checkCollision(walls.getChildrenByName("wallTop")[0]) ||
                projectile.checkCollision(walls.getChildrenByName("wallBottom")[0])) {
                projectiles.removeChild(projectile);
            }
        }
    }
    function hndKeyDown(_event) {
        if (_event.code === "Space") {
            if (attackCooldownCounter > character.attackCoolDownSeconds) {
                const projectileStartX = character.getChild(0).mtxWorld.translation.x;
                const projectileStartY = character.getChild(0).mtxWorld.translation.y + projectileOffset;
                let projectile = new L02_SpaceInvader.Projectile("Projectile", new f.Vector2(projectileStartX, projectileStartY));
                projectiles.addChild(projectile);
                attackCooldownCounter = 0;
            }
        }
    }
    function createCharacter() {
        let characterNode = new f.Node("Character");
        character = new L02_SpaceInvader.Character("character", new f.Vector2(0, 0));
        characterNode.addChild(character);
        root.addChild(characterNode);
    }
    function createWalls() {
        walls = new f.Node("walls");
        let wallLeft = new L02_SpaceInvader.Wall("wallLeft", new f.Vector2(-9.25, 6), new f.Vector2(0.1, 14));
        let wallRight = new L02_SpaceInvader.Wall("wallRight", new f.Vector2(9.25, 6), new f.Vector2(0.1, 14));
        let wallTop = new L02_SpaceInvader.Wall("wallTop", new f.Vector2(0, 13), new f.Vector2(18.5, 0.1));
        let wallBottom = new L02_SpaceInvader.Wall("wallBottom", new f.Vector2(0, -1), new f.Vector2(18.5, 0.1));
        walls.addChild(wallLeft);
        walls.addChild(wallRight);
        walls.addChild(wallTop);
        walls.addChild(wallBottom);
        root.addChild(walls);
    }
    function createCovers() {
        covers = new f.Node("covers");
        let xPositionCover = xStartPosition;
        const yPositionCover = 3;
        for (let l = 0; l < 4; l++) {
            let cover = new L02_SpaceInvader.Cover("cover" + l, new f.Vector2(xPositionCover, yPositionCover));
            xPositionCover += 5;
            covers.addChild(cover);
        }
        root.addChild(covers);
    }
    function createInvaders() {
        invaders = new f.Node("Invaders");
        let xPositionInvader = xStartPosition;
        let yPositionInvader = yInvaderStart;
        const invaderLineHeight = 1.2;
        const invaderSpaceWidth = 1.2;
        const countOfInvadersInRow = 14;
        const countInvaderRows = 4;
        for (let i = 0; i < countInvaderRows; i++) {
            for (let j = 0; j < countOfInvadersInRow; j++) {
                let invader = new L02_SpaceInvader.Invader("Invader" + i * countOfInvadersInRow + j, new f.Vector2(xPositionInvader, yPositionInvader), new f.Vector2(0.8, 0.8));
                invaders.addChild(invader);
                xPositionInvader += invaderSpaceWidth;
            }
            xPositionInvader = xStartPosition;
            yPositionInvader -= invaderLineHeight;
        }
        root.addChild(invaders);
    }
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Main.js.map