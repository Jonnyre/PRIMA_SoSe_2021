namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class Projectile extends SpaceInvaderObject {
    private velocity: number = 10;
    constructor(_name: string, _position: f.Vector2) {
      super(_name, _position, new f.Vector2(0.1, 0.7), "white");
    }

    public move(): void {
      let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
      this.mtxLocal.translateY(timeSinceLastFrame * this.velocity);
    }
  }
}
