namespace L02_SpaceInvader {
    import f = FudgeCore;
  
    export class Cover extends SpaceInvaderObject {
      constructor(_name: string, _position: f.Vector2) {
        super(_name, _position, new f.Vector2(1.5, 1.5), "white");
      }
    }
  }
  