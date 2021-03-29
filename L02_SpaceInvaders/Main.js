"use strict";
var L02_SpaceInvader;
(function (L02_SpaceInvader) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let root = new f.Node("root");
    let viewport = new f.Viewport();
    let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("WHITE")));
    let meshQuad = new f.MeshQuad();
    let meshSphere = new f.MeshSphere("Sphere", 50, 10);
    const xStartPosition = -8;
    const yEnemyStart = 12;
    function init(_event) {
        const canvas = document.querySelector("canvas");
        createCharacter();
        createWalls();
        createEnemies();
        createCovers();
        createProjectile();
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(20);
        cmpCamera.mtxPivot.translateY(6);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        f.Debug.log(viewport);
        viewport.draw();
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        // let rotSpeed: number = 90;
        // let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
        // node.mtxLocal.rotateZ(rotSpeed * timeSinceLastFrame);
        viewport.draw();
    }
    function createCharacter() {
        let character = new f.Node("character");
        let characterBody = new f.Node("characterBody");
        let cmpQuad = new f.ComponentMesh(meshQuad);
        characterBody.addComponent(cmpQuad);
        cmpQuad.mtxPivot.scale(new f.Vector3(1, 0.4, 0));
        characterBody.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0))));
        characterBody.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        let characterWeapon = new f.Node("characterBody");
        let cmpQuadWeapon = new f.ComponentMesh(meshQuad);
        characterWeapon.addComponent(cmpQuadWeapon);
        cmpQuadWeapon.mtxPivot.scale(new f.Vector3(0.2, 0.2, 0));
        characterWeapon.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0.3, 0))));
        characterWeapon.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        character.addChild(characterBody);
        character.addChild(characterWeapon);
        root.addChild(character);
    }
    function createWalls() {
        let walls = new f.Node("walls");
        let wallLeft = new f.Node("wallLeft");
        let cmpQuadLeft = new f.ComponentMesh(meshQuad);
        wallLeft.addComponent(cmpQuadLeft);
        cmpQuadLeft.mtxPivot.scale(new f.Vector3(0.1, 13.5, 0));
        wallLeft.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        wallLeft.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(-9.25, 6, 0))));
        let wallRight = new f.Node("wallRight");
        let cmpQuadRight = new f.ComponentMesh(meshQuad);
        wallRight.addComponent(cmpQuadRight);
        cmpQuadRight.mtxPivot.scale(new f.Vector3(0.1, 13.5, 0));
        wallRight.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        wallRight.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(9.25, 6, 0))));
        // let wallTop: f.Node = new f.Node("wallTop");
        // let wallBottom: f.Node = new f.Node("wallBottom");
        walls.addChild(wallLeft);
        walls.addChild(wallRight);
        root.addChild(walls);
    }
    function createCovers() {
        let covers = new f.Node("covers");
        let xPositionCover = xStartPosition + 0.5;
        for (let i = 0; i < 4; i++) {
            let cover = new f.Node("cover" + i);
            let cmpMesh = new f.ComponentMesh(meshQuad);
            cmpMesh.mtxPivot.scale(new f.Vector3(1.5, 1.5, 0));
            cover.addComponent(cmpMesh);
            let cmpTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(xPositionCover, 2, 0)));
            cover.addComponent(cmpTransform);
            cover.addComponent(new f.ComponentMaterial(mtrSolidWhite));
            covers.addChild(cover);
            xPositionCover += 5;
        }
        root.addChild(covers);
    }
    function createEnemies() {
        let enemies = new f.Node("enemies");
        let xPositionEnemy = xStartPosition;
        let yPositionEnemy = yEnemyStart;
        const enemyLineHeight = 1;
        const enemySpaceWidth = 1.2;
        for (let i = 0; i < 40; i++) {
            if (i % 14 == 0 && i != 0) {
                yPositionEnemy -= enemyLineHeight;
                xPositionEnemy = xStartPosition;
            }
            let enemy = new f.Node("enemy" + i);
            let cmpMesh = new f.ComponentMesh(meshSphere);
            cmpMesh.mtxPivot.scale(new f.Vector3(0.8, 0.8, 0));
            enemy.addComponent(cmpMesh);
            enemy.addComponent(new f.ComponentMaterial(mtrSolidWhite));
            let cmpTransform = new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(xPositionEnemy, yPositionEnemy, 0)));
            enemy.addComponent(cmpTransform);
            enemies.addChild(enemy);
            xPositionEnemy += enemySpaceWidth;
        }
        root.addChild(enemies);
    }
    function createProjectile() {
        let projectile = new f.Node("projectile");
        let cmpQuad = new f.ComponentMesh(meshQuad);
        projectile.addComponent(cmpQuad);
        cmpQuad.mtxPivot.scale(new f.Vector3(0.1, 0.7, 0));
        projectile.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(new f.Vector3(0, 4, 0))));
        projectile.addComponent(new f.ComponentMaterial(mtrSolidWhite));
        root.addChild(projectile);
    }
})(L02_SpaceInvader || (L02_SpaceInvader = {}));
//# sourceMappingURL=Main.js.map