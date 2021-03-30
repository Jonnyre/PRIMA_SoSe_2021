namespace L02_SpaceInvader {
  import f = FudgeCore;

  export class SpaceInvaderObject extends f.Node {
      private static meshQuad: f.MeshQuad = new f.MeshQuad();
      private static mtrSolidWhite: f.Material = new f.Material(
        "SolidWhite",
        f.ShaderUniColor,
        new f.CoatColored(f.Color.CSS("WHITE"))
      );

      public constructor(_name: string, _position: f.Vector2, _size: f.Vector2, _material: string) {
          super(_name);
          this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position.toVector3(0))));
          let cmpQuad: f.ComponentMesh = new f.ComponentMesh(SpaceInvaderObject.meshQuad);
          cmpQuad.mtxPivot.scale(_size.toVector3(0));
          this.addComponent(cmpQuad);

          if (_material == "white") {
              let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(SpaceInvaderObject.mtrSolidWhite);
              this.addComponent(cmpMaterial);
          }
      }
  }
}
