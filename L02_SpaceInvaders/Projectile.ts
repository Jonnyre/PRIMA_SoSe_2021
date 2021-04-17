namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class Projectile extends SpaceInvaderObject {
    public fromInvader: boolean;
    private velocity: number = 10;

    constructor(_name: string, _position: f.Vector2, _fromInvader: boolean) {
      super(_name, _position, new f.Vector2(0.1, 0.4));
      this.fromInvader = _fromInvader;
      if (_fromInvader) {
        this.velocity = -10;
      }
    }

    public move(): void {
      let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
      this.mtxLocal.translateY(timeSinceLastFrame * this.velocity);
      this.setRectPosition();
    }
  }
}
