"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let root = new f.Node("root");
    let viewport = new f.Viewport();
    let character;
    let projectiles;
    let crtSideways = new f.Control("PaddleControl", 0.2, 0 /* PROPORTIONAL */);
    crtSideways.setDelay(100);
    const xStartPosition = -8;
    const yInvaderStart = 11;
    function init(_event) {
        const canvas = document.querySelector("canvas");
        window.addEventListener("keydown", hndKeyDown);
        createCharacter();
        createWalls();
        createInvaders();
        createCovers();
        projectiles = new f.Node("Projectiles");
        root.addChild(projectiles);
        let motherShip = new L02_SpaceInvader.MotherShip("MotherShip", new f.Vector2(3, 12.5));
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
        crtSideways.setInput(f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])
            + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT]));
        for (let projectile of projectiles.getChildren()) {
            projectile.move();
        }
        character.mtxLocal.translateX(crtSideways.getOutput());
        viewport.draw();
    }
    function hndKeyDown(_event) {
        if (_event.code === "Space") {
            const projectileStartX = character.mtxLocal.translation.x;
            const projectileStartY = character.mtxLocal.translation.y;
            let projectile = new L02_SpaceInvader.Projectile("Projectile", new f.Vector2(projectileStartX, projectileStartY));
            projectiles.addChild(projectile);
        }
    }
    function createCharacter() {
        let characterNode = new f.Node("Character");
        character = new L02_SpaceInvader.Character("character", new f.Vector2(0, 0));
        characterNode.addChild(character);
        root.addChild(characterNode);
    }
    function createWalls() {
        let walls = new f.Node("walls");
        let wallLeft = new L02_SpaceInvader.Wall("wallLeft", new f.Vector2(-9.25, 6));
        let wallRight = new L02_SpaceInvader.Wall("wallRight", new f.Vector2(9.25, 6));
        walls.addChild(wallLeft);
        walls.addChild(wallRight);
        root.addChild(walls);
    }
    function createCovers() {
        let covers = new f.Node("covers");
        let xPositionCover = xStartPosition;
        const yPositionCover = 2.5;
        for (let l = 0; l < 4; l++) {
            let cover = new L02_SpaceInvader.Cover("cover" + l, new f.Vector2(xPositionCover, yPositionCover));
            xPositionCover += 5;
            covers.addChild(cover);
        }
        root.addChild(covers);
    }
    function createInvaders() {
        let invaders = new f.Node("Invaders");
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