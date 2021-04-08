namespace L02_SpaceInvader {
  import f = FudgeCore;

  window.addEventListener("load", init);

  let root: f.Node = new f.Node("root");
  let viewport: f.Viewport = new f.Viewport();

  let character: Character;
  let projectiles: f.Node;
  let covers: f.Node;
  let invaders: f.Node;
  let walls: f.Node;

  let attackCooldownCounter: number = 0;

  const xStartPosition: number = -8;
  const yInvaderStart: number = 11;
  const projectileOffset: number = 1;

  function init(_event: Event): void {
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    window.addEventListener("keydown", hndKeyDown);
    createCharacter();
    createWalls();
    createInvaders();
    createCovers();
    projectiles = new f.Node("Projectiles");
    root.addChild(projectiles);
    let motherShip: MotherShip = new MotherShip("MotherShip", new f.Vector2(3, 12.25));
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
    moveCharacter();

    attackCooldownCounter += f.Loop.timeFrameGame / 1000;

    checkProjectileCollision();

    for (let projectile of projectiles.getChildren() as Projectile[]) {
      projectile.move();
    }

    viewport.draw();
  }

  function moveCharacter(): void {
    let oldCharacterPos: f.Vector3 = character.mtxLocal.translation;
    let oldCharacterRectX: number = character.rect.position.x;

    let offset: number = (character.speed * f.Loop.timeFrameReal) / 1000;

    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])) {
      character.mtxLocal.translateX(-offset);
      character.setRectPosition();
    }
      

    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])) {
      character.mtxLocal.translateX(+offset);
      character.setRectPosition();
    }
      

    if (character.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallLeft")[0]) ||
       character.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallRight")[0])) {
      character.mtxLocal.translation = oldCharacterPos;
      character.rect.position.x = oldCharacterRectX;
    }
  }

  function checkProjectileCollision(): void {
    for (let projectile of projectiles.getChildren() as Projectile[]) {
      for (let cover of covers.getChildren() as Cover[]) {
        for (let stripe of cover.getChildren() as SpaceInvaderObject[]) {
          if (projectile.checkCollision(stripe)) {
            projectiles.removeChild(projectile);
            cover.removeChild(stripe);
          }
        }
      }

      for (let invader of invaders.getChildren() as Invader[]) {
        if (projectile.checkCollision(invader)) {
          projectiles.removeChild(projectile);
          invaders.removeChild(invader);
        }
      }

      if (projectile.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallTop")[0]) ||
        projectile.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallBottom")[0])) {
        projectiles.removeChild(projectile);
      }
    }
  }
  
  function hndKeyDown(_event: KeyboardEvent): void {
    if (_event.code === "Space") {
      if (attackCooldownCounter > character.attackCoolDownSeconds) {
        const projectileStartX = character.getChild(0).mtxWorld.translation.x;
        const projectileStartY = character.getChild(0).mtxWorld.translation.y + projectileOffset;
        let projectile: Projectile = new Projectile("Projectile", new f.Vector2(projectileStartX, projectileStartY));
        projectiles.addChild(projectile);
        attackCooldownCounter = 0;
      }
    }
  }

  function createCharacter(): void {
    let characterNode: f.Node = new f.Node("Character");
    character = new Character("character", new f.Vector2(0, 0));

    characterNode.addChild(character);
    root.addChild(characterNode);
  }

  function createWalls(): void {
    walls = new f.Node("walls");
    let wallLeft: Wall = new Wall("wallLeft", new f.Vector2(-9.25, 6), new f.Vector2(0.1, 14));
    let wallRight: Wall = new Wall("wallRight", new f.Vector2(9.25, 6), new f.Vector2(0.1, 14));
    let wallTop: Wall = new Wall("wallTop", new f.Vector2(0, 13), new f.Vector2(18.5, 0.1));
    let wallBottom: Wall = new Wall("wallBottom", new f.Vector2(0, -1), new f.Vector2(18.5, 0.1));

    walls.addChild(wallLeft);
    walls.addChild(wallRight);
    walls.addChild(wallTop);
    walls.addChild(wallBottom);
    root.addChild(walls);
  }

  function createCovers(): void {
    covers = new f.Node("covers");
    let xPositionCover: number = xStartPosition;
    const yPositionCover: number = 3;

    for (let l: number = 0; l < 4; l++) {
      let cover: Cover = new Cover("cover" + l, new f.Vector2(xPositionCover, yPositionCover));
      xPositionCover += 5;
      covers.addChild(cover);
    }

    root.addChild(covers);
  }

  function createInvaders(): void {
    invaders = new f.Node("Invaders");

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
