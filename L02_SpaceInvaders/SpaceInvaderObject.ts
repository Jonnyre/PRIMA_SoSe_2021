namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class SpaceInvaderObject extends f.Node {
      private static meshQuad: f.MeshQuad = new f.MeshQuad();
      private static mtrWhite: f.Material = new f.Material("White", f.ShaderUniColor, new f.CoatColored());
      private static textureInvader: f.TextureImage = new f.TextureImage("./Assets/invader.png");
      private static mtrInvader: f.Material = new f.Material("Invader", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), SpaceInvaderObject.textureInvader));
      private static textureMotherShip: f.TextureImage = new f.TextureImage("./Assets/mothership.png");
      private static mtrMotherShip: f.Material = new f.Material("MotherShip", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), SpaceInvaderObject.textureMotherShip));

      public rect: f.Rectangle;

      public constructor(_name: string, _position: f.Vector2, _size: f.Vector2, _texture?: string) {
          super(_name);
          this.rect = new f.Rectangle(_position.x, _position.y, _size.x, _size.y, f.ORIGIN2D.CENTER);
          this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position.toVector3(0))));
          let cmpQuad: f.ComponentMesh = new f.ComponentMesh(SpaceInvaderObject.meshQuad);
          cmpQuad.mtxPivot.scale(_size.toVector3(0));
          this.addComponent(cmpQuad);
          if (_texture === "invader") {
            this.addComponent(new f.ComponentMaterial(SpaceInvaderObject.mtrInvader));
          } else if (_texture === "mothership") {
            this.addComponent(new f.ComponentMaterial(SpaceInvaderObject.mtrMotherShip));
          }
          else {
            this.addComponent(new f.ComponentMaterial(SpaceInvaderObject.mtrWhite));
          }
      }

      public checkCollision(_target: SpaceInvaderObject): boolean {
        return this.rect.collides(_target.rect);
      }

      public setRectPosition(): void {
        this.rect.position.x = this.mtxLocal.translation.x - this.rect.size.x / 2;
        this.rect.position.y = this.mtxLocal.translation.y - this.rect.size.y / 2;
      }
  }
}
