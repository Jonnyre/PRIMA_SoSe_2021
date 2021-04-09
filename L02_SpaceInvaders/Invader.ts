namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class Invader extends SpaceInvaderObject {
    
    constructor(_name: string, _position: f.Vector2, _size: f.Vector2) {
      super(_name, _position, _size, "invader");
    }

    public move(_velocity: number): void {
      let timeSinceLastFrame: number = f.Loop.timeFrameReal / 1000;
      this.mtxLocal.translateX(timeSinceLastFrame * _velocity);
      this.setRectPosition();
    }
  }
}
