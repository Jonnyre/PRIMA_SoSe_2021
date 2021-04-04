namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class Cover extends f.Node {
    private stripeSize: f.Vector2 = new f.Vector2(0.3, 0.3);
    private coverSize: number = 1.5;
    private stripeRowCount: number = 5;
    private xPosStripe: number = this.coverSize / this.stripeRowCount;
    
    constructor(_name: string, _position: f.Vector2) {
      super(_name);

      let stripePosition: f.Vector2 = new f.Vector2(_position.x, _position.y);
      for (let i: number = 0; i < 5; i++) {
        for (let j: number = 0; j < 5; j++) {
          let stripe: SpaceInvaderObject = new SpaceInvaderObject("stripe" + i * 5 + j, new f.Vector2(stripePosition.x, stripePosition.y), this.stripeSize);
          this.addChild(stripe);
          stripePosition.x += this.xPosStripe;
        }
        stripePosition.x = _position.x;
        stripePosition.y -= this.xPosStripe;
      }
    }
  }
}
