"use strict";
var L01_FirstFudge;
(function (L01_FirstFudge) {
    var f = FudgeCore;
    window.addEventListener("load", init);
    let node = new f.Node("Quad");
    let viewport = new f.Viewport();
    function init(_event) {
        const canvas = document.querySelector("canvas");
        node.addComponent(new f.ComponentTransform());
        let mesh = new f.MeshCube();
        let cmpMesh = new f.ComponentMesh(mesh);
        node.addComponent(cmpMesh);
        let mtrSolidWhite = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("WHITE")));
        let cmpMaterial = new f.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);
        let cmpCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(2);
        cmpCamera.mtxPivot.rotateY(180);
        viewport.initialize("Viewport", node, cmpCamera, canvas);
        f.Debug.log(viewport);
        viewport.draw();
        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
    }
    function update(_event) {
        let rotSpeed = 90;
        let timeSinceLastFrame = f.Loop.timeFrameReal / 1000;
        node.mtxLocal.rotateZ(rotSpeed * timeSinceLastFrame);
        viewport.draw();
    }
})(L01_FirstFudge || (L01_FirstFudge = {}));
//# sourceMappingURL=Test.js.map