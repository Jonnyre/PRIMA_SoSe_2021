namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class Character extends SpaceInvaderObject {
    constructor(_name: string, _position: f.Vector2) {
      super(_name, _position, new f.Vector2(1, 0.4), "white");

      let characterWeapon: SpaceInvaderObject = new SpaceInvaderObject("characterWeapon", new f.Vector2(0, 0.3), new f.Vector2(0.2, 0.2), "white");
      this.addChild(characterWeapon);
    }
  }
}
