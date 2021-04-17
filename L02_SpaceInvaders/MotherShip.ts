namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class MotherShip extends SpaceInvaderObject {
    private velocity: number = 5;
    constructor(_name: string, _position: f.Vector2) {
      super(_name, _position, new f.Vector2(2, 1), "mothership");
    }

    public move(): void {
      let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
      this.mtxLocal.translateX(timeSinceLastFrame * this.velocity);
      this.setRectPosition();
    }

    public invertVelocity(): void {
      this.velocity = this.velocity * -1;
    }
  }
}