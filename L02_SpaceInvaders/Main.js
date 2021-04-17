"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let root;
    let viewport = new f.Viewport();
    let character;
    let projectiles;
    let covers;
    let invaders;
    let walls;
    let motherShipNode;
    let motherShip;
    const xStartPosition = -8;
    const yInvaderStart = 11;
    const projectileOffset = 1;
    const invaderLineHeight = 1;
    const invaderSpeedGain = 0.1;
    const motherShipRespawnRate = 15000;
    let velocity;
    let gameOver = false;
    let gunReady = true;
    let enemyShootChancePercentage;
    let gameOverDiv;
    let scoreValue;
    let score;
    let lifeValue;
    let characterLife;
    function init() {
        root = new f.Node("root");
        gameOverDiv = document.getElementById("gameOver");
        scoreValue = document.getElementById("scoreValue");
        lifeValue = document.getElementById("lifeValue");
        score = 0;
        updateScore();
        velocity = 10;
        characterLife = 3;
        updateLife();
        enemyShootChancePercentage = 1;
        const canvas = document.querySelector("canvas");
        let restartButton = document.getElementById("restart");
        restartButton.addEventListener("click", hndClick);
        createCharacter();
        createWalls();
        createInvaders();
        createCovers();
        projectiles = new f.Node("Projectiles");
        root.addChild(projectiles);
        motherShipNode = new f.Node("MotherShip");
        root.addChild(motherShipNode);
        f.Time.game.setTimer(300, 0, moveInvaders);
        f.Time.game.setTimer(300, 0, invaderShoot);
        f.Time.game.setTimer(motherShipRespawnRate, 1, createMotherShip);
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
        if (gameOver) {
            return;
        }
        moveCharacter();
        if (gunReady && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            shootProjectile();
        }
        checkProjectileCollision();
        for (let projectile of projectiles.getChildren()) {
            projectile.move();
        }
        checkMotherShipCollision();
        viewport.draw();
    }
    function invaderShoot() {
        for (let invader of invaders.getChildren()) {
            let otherInvaderBelow = false;
            if (Math.random() < enemyShootChancePercentage / 100) {
                for (let invaderSecond of invaders.getChildren()) {
                    if (invaderSecond == invader) {
                        continue;
                    }
                    if (invader.rectBelow.collides(invaderSecond.rect)) {
                        otherInvaderBelow = true;
                    }
                }
                if (!otherInvaderBelow) {
                    let projectile = new L02_SpaceInvader.Projectile("Projectile", new f.Vector2(invader.mtxLocal.translation.x, invader.mtxLocal.translation.y), true);
                    projectiles.addChild(projectile);
                }
            }
        }
    }
    function shootProjectile() {
        const projectileStartX = character.getChild(0).mtxWorld.translation.x;
        const projectileStartY = character.getChild(0).mtxWorld.translation.y + projectileOffset;
        let projectile = new L02_SpaceInvader.Projectile("Projectile", new f.Vector2(projectileStartX, projectileStartY), false);
        projectiles.addChild(projectile);
        gunReady = false;
        f.Time.game.setTimer(1000, 1, () => gunReady = true);
    }
    function moveInvadersOnCollision(_xTranslateInvadersOnColision) {
        velocity = -1 * velocity;
        for (let invaderInner of invaders.getChildren()) {
            invaderInner.mtxLocal.translateX(_xTranslateInvadersOnColision);
            invaderInner.mtxLocal.translateY(-invaderLineHeight);
            invaderInner.setRectPosition();
        }
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
            if (!projectile.fromInvader) {
                for (let invader of invaders.getChildren()) {
                    if (projectile.checkCollision(invader)) {
                        projectiles.removeChild(projectile);
                        invaders.removeChild(invader);
                        score += 1;
                        updateScore();
                        enemyShootChancePercentage += 0.1;
                        if (invaders.nChildren === 0)
                            doGameOver();
                        if (Math.sign(velocity) === 1)
                            velocity += invaderSpeedGain;
                        else
                            velocity = -1 * (Math.abs(velocity) + invaderSpeedGain);
                    }
                }
            }
            else {
                if (projectile.checkCollision(character)) {
                    projectiles.removeChild(projectile);
                    characterLife--;
                    updateLife();
                    if (characterLife === 0) {
                        doGameOver();
                    }
                }
            }
            if (projectile.checkCollision(walls.getChildrenByName("wallTop")[0]) ||
                projectile.checkCollision(walls.getChildrenByName("wallBottom")[0])) {
                projectiles.removeChild(projectile);
            }
            if (motherShip) {
                if (projectile.checkCollision(motherShip)) {
                    projectiles.removeChild(projectile);
                    motherShipNode.removeChild(motherShip);
                    score += 10;
                    updateScore();
                    f.Time.game.setTimer(motherShipRespawnRate, 1, createMotherShip);
                }
            }
        }
    }
    function createCharacter() {
        character = new L02_SpaceInvader.Character("character", new f.Vector2(0, 0));
        root.addChild(character);
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
        const invaderSpaceWidth = 1.2;
        const countOfInvadersInRow = 10;
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
    function hndClick() {
        gameOver = false;
        gameOverDiv.style.display = "none";
        init();
    }
    function moveInvaders() {
        let xTranslateInvadersOnColision = 0.5;
        for (let invader of invaders.getChildren()) {
            if (invader.checkCollision(walls.getChildrenByName("wallRight")[0])) {
                moveInvadersOnCollision(-xTranslateInvadersOnColision);
            }
            if (invader.checkCollision(walls.getChildrenByName("wallLeft")[0])) {
                moveInvadersOnCollision(xTranslateInvadersOnColision);
            }
            invader.move(velocity);
            invader.setRectPosition();
        }
    }
    function doGameOver() {
        gameOver = true;
        gameOverDiv.style.display = "block";
    }
    function createMotherShip() {
        if (motherShipNode.nChildren !== 0)
            return;
        motherShip = new L02_SpaceInvader.MotherShip("MotherShip", new f.Vector2(3, 12.25));
        motherShipNode.addChild(motherShip);
    }
    function checkMotherShipCollision() {
        if (motherShip) {
            if (motherShip.checkCollision(walls.getChildrenByName("wallRight")[0]) || motherShip.checkCollision(walls.getChildrenByName("wallLeft")[0])) {
                motherShip.invertVelocity();
            }
            motherShip.move();
        }
    }
    function updateScore() {
        scoreValue.innerHTML = score.toString();
    }
    function updateLife() {
        lifeValue.innerHTML = characterLife.toString();
    }
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Main.js.map