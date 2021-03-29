namespace L01_FirstFudge {
    import f = FudgeCore;

    window.addEventListener("load", init);

    let node: f.Node = new f.Node("Quad");
    let viewport: f.Viewport = new f.Viewport();

    function init(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");

        node.addComponent(new f.ComponentTransform());
        let mesh: f.MeshCube = new f.MeshCube();
        let cmpMesh: f.ComponentMesh = new f.ComponentMesh(mesh);
        node.addComponent(cmpMesh);
        
        let mtrSolidWhite: f.Material = new f.Material("SolidWhite", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("WHITE")));
        let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(mtrSolidWhite);
        node.addComponent(cmpMaterial);

        let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
        cmpCamera.mtxPivot.translateZ(2);
        cmpCamera.mtxPivot.rotateY(180);

        viewport.initialize("Viewport", node, cmpCamera, canvas);
        f.Debug.log(viewport);

        viewport.draw();

        f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    }

    function update(_event: Event): void {
        let rotSpeed: number = 90;
        let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
        node.mtxLocal.rotateZ(rotSpeed * timeSinceLastFrame);
        viewport.draw();
    }
}