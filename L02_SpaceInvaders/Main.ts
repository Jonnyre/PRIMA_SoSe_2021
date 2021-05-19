namespace L02_SpaceInvader {
  import f = FudgeCore;

  window.addEventListener("load", init);

  let root: f.Node;
  let viewport: f.Viewport = new f.Viewport();

  let character: Character;
  let projectiles: f.Node;
  let covers: f.Node;
  let invaders: f.Node;
  let walls: f.Node;
  let motherShipNode: f.Node;
  let motherShip: MotherShip;

  const xStartPosition: number = -8;
  const yInvaderStart: number = 11;
  const projectileOffset: number = 1;
  const invaderLineHeight: number = 1;
  const invaderSpeedGain: number = 0.1;
  const motherShipRespawnRate: number = 15000;

  let velocity: number;
  let gameOver: boolean = false;
  let gunReady: boolean = true;
  let enemyShootChancePercentage: number;

  let gameOverDiv: HTMLDivElement;
  let scoreValue: HTMLParagraphElement;
  let score: number;
  let lifeValue: HTMLParagraphElement;
  let characterLife: number;
  function init(): void {
    root = new f.Node("root");
    gameOverDiv = <HTMLDivElement>document.getElementById("gameOver");
    scoreValue = <HTMLParagraphElement>document.getElementById("scoreValue");
    lifeValue = <HTMLParagraphElement>document.getElementById("lifeValue");
    score = 0;
    updateScore();
    velocity = 10;
    characterLife = 3;
    updateLife();
    enemyShootChancePercentage = 1;
    const canvas: HTMLCanvasElement = document.querySelector("canvas");
    let restartButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("restart");
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
    if (gameOver) {
      return;
    }

    moveCharacter();

    if (gunReady && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
      shootProjectile();
    }
    checkProjectileCollision();

    for (let projectile of projectiles.getChildren() as Projectile[]) {
      projectile.move();
    }

    checkMotherShipCollision();
    viewport.draw();
  }

  function invaderShoot(): void {
    for (let invader of invaders.getChildren() as Invader[]) {
      let otherInvaderBelow: boolean = false;
      if (Math.random() < enemyShootChancePercentage / 100) {
        for (let invaderSecond of invaders.getChildren() as Invader[]) {
          if (invaderSecond == invader) {
            continue;
          }

          if (invader.rectBelow.collides(invaderSecond.rect)) {
            otherInvaderBelow = true;
          }
        }
        if (!otherInvaderBelow) {
          let projectile: Projectile = new Projectile("Projectile", new f.Vector2(invader.mtxLocal.translation.x, invader.mtxLocal.translation.y), true);
          projectiles.addChild(projectile);
        }
      }
    }
  }

  function shootProjectile(): void {
    const projectileStartX: number = character.getChild(0).mtxWorld.translation.x;
    const projectileStartY: number = character.getChild(0).mtxWorld.translation.y + projectileOffset;
    let projectile: Projectile = new Projectile("Projectile", new f.Vector2(projectileStartX, projectileStartY), false);
    projectiles.addChild(projectile);
    gunReady = false;
    f.Time.game.setTimer(1000, 1, () => gunReady = true);
  }

  function moveInvadersOnCollision(_xTranslateInvadersOnColision: number): void {
    velocity = -1 * velocity;
    for (let invaderInner of invaders.getChildren() as Invader[]) {
      invaderInner.mtxLocal.translateX(_xTranslateInvadersOnColision);
      invaderInner.mtxLocal.translateY(-invaderLineHeight);
      invaderInner.setRectPosition();
    }
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

      if (!projectile.fromInvader) {
        for (let invader of invaders.getChildren() as Invader[]) {
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
      } else {
        if (projectile.checkCollision(character)) {
          projectiles.removeChild(projectile);
          characterLife--;
          updateLife();
          if (characterLife === 0) {
            doGameOver();
          }
        }
      }


      if (projectile.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallTop")[0]) ||
        projectile.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallBottom")[0])) {
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

  function createCharacter(): void {
    character = new Character("character", new f.Vector2(0, 0));
    root.addChild(character);
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
    const invaderSpaceWidth: number = 1.2;
    const countOfInvadersInRow: number = 10;
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

  function hndClick(): void {
    gameOver = false;
    gameOverDiv.style.display = "none";
    init();
  }

  function moveInvaders(): void {
    let xTranslateInvadersOnColision: number = 0.5;
    for (let invader of invaders.getChildren() as Invader[]) {
      if (invader.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallRight")[0])) {
        moveInvadersOnCollision(-xTranslateInvadersOnColision);
      }

      if (invader.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallLeft")[0])) {
        moveInvadersOnCollision(xTranslateInvadersOnColision);
      }

      invader.move(velocity);
      invader.setRectPosition();
    }
  }

  function doGameOver(): void {
    gameOver = true;
    gameOverDiv.style.display = "block";
  }

  function createMotherShip(): void {
    if (motherShipNode.nChildren !== 0) return;

    motherShip = new MotherShip("MotherShip", new f.Vector2(3, 12.25));
    motherShipNode.addChild(motherShip);

  }

  function checkMotherShipCollision(): void {
    if (motherShip) {
      if (motherShip.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallRight")[0]) || motherShip.checkCollision(<SpaceInvaderObject>walls.getChildrenByName("wallLeft")[0])) {
        motherShip.invertVelocity();
      }
      motherShip.move();
    }
  }

  function updateScore(): void {
    scoreValue.innerHTML = score.toString();
  }
  function updateLife(): void {
    lifeValue.innerHTML = characterLife.toString();
  }
}
