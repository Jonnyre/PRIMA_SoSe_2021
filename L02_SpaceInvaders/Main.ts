namespace L02_SpaceInvader {
  import f = FudgeCore;

  window.addEventListener("load", init);

  let root: f.Node = new f.Node("root");
  let viewport: f.Viewport = new f.Viewport();

  let character: Character;
  let projectiles: f.Node;

  let crtSideways: f.Control = new f.Control("PaddleControl", 0.2, f.CONTROL_TYPE.PROPORTIONAL);
  crtSideways.setDelay(100);

  const xStartPosition: number = -8;
  const yInvaderStart: number = 11;

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    window.addEventListener("keydown", hndKeyDown);
    createCharacter();
    createWalls();
    createInvaders();
    createCovers();
    projectiles = new f.Node("Projectiles");
    root.addChild(projectiles);
    let motherShip: MotherShip = new MotherShip("MotherShip", new f.Vector2(3, 12.5));
    root.addChild(motherShip);

    let cmpCamera: f.ComponentCamera = new f.ComponentCamera();
    cmpCamera.mtxPivot.translateZ(20);
    cmpCamera.mtxPivot.translateY(6);
    cmpCamera.mtxPivot.rotateY(180);

    viewport.initialize("Viewport", root, cmpCamera, canvas);

    viewport.draw();

    f.Loop.start(f.LOOP_MODE.TIME_REAL, 60);
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
  }

  function update(_event: Event): void {
    crtSideways.setInput(
      f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])
      + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])
    );

    for (let projectile of projectiles.getChildren() as Projectile[]) {
      projectile.move();
    }

    character.mtxLocal.translateX(crtSideways.getOutput());
    viewport.draw();
  }

  function hndKeyDown(_event: KeyboardEvent): void {
    if (_event.code === "Space") {
      const projectileStartX = character.mtxLocal.translation.x;
      const projectileStartY = character.mtxLocal.translation.y;
      let projectile: Projectile = new Projectile("Projectile", new f.Vector2(projectileStartX, projectileStartY));
      projectiles.addChild(projectile);
    }
  }

  function createCharacter(): void {
    let characterNode: f.Node = new f.Node("Character");
    character = new Character("character", new f.Vector2(0, 0));

    characterNode.addChild(character);
    root.addChild(characterNode);
  }

  function createWalls(): void {
    let walls: f.Node = new f.Node("walls");
    let wallLeft: Wall = new Wall("wallLeft", new f.Vector2(-9.25, 6));
    let wallRight: Wall = new Wall("wallRight", new f.Vector2(9.25, 6));

    walls.addChild(wallLeft);
    walls.addChild(wallRight);
    root.addChild(walls);
  }

  function createCovers(): void {
    let covers: f.Node = new f.Node("covers");
    let xPositionCover: number = xStartPosition;
    const yPositionCover: number = 2.5;
    
    for (let l: number = 0; l < 4; l++) {
      let cover: Cover = new Cover("cover" + l, new f.Vector2(xPositionCover, yPositionCover));
      xPositionCover += 5;
      covers.addChild(cover);
    }

    root.addChild(covers);
  }

  function createInvaders(): void {
    let invaders: f.Node = new f.Node("Invaders");

    let xPositionInvader: number = xStartPosition;
    let yPositionInvader: number = yInvaderStart;
    const invaderLineHeight: number = 1.2;
    const invaderSpaceWidth: number = 1.2;
    const countOfInvadersInRow: number = 14;
    const countInvaderRows: number = 4;

    for (let i: number = 0; i < countInvaderRows; i++) {
      for (let j: number = 0; j < countOfInvadersInRow; j++) {
        let invader: Invader = new Invader("Invader" + i * countOfInvadersInRow + j, new f.Vector2(xPositionInvader, yPositionInvader), new f.Vector2(0.8, 0.8));
        invaders.addChild(invader);
        xPositionInvader += invaderSpaceWidth;
      }
      xPositionInvader = xStartPosition;
      yPositionInvader -= invaderLineHeight;
    }
    root.addChild(invaders);
  }
}
