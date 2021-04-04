namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class MotherShip extends SpaceInvaderObject {
    constructor(_name: string, _position: f.Vector2) {
      super(_name, _position, new f.Vector2(2, 1));
    }
  }
}