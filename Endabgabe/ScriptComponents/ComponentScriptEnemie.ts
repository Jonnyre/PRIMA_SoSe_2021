namespace Endabgabe {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(Endabgabe);

    export class ComponentScriptEnemie extends f.ComponentScript {
        private static textureEnemie: f.TextureImage = new f.TextureImage("./Assets/Ghost.png");
        private static mtrEnemie: f.Material = new f.Material("Arrow", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), ComponentScriptEnemie.textureEnemie));

        public enemyProps: IEnemie;
        constructor() {
            super();
            f.Time.game.setTimer(500, 1, this.addMtr.bind(this));
        }

        private addMtr(_event: CustomEvent): void {
            let container: f.Node = this.getContainer();
            container.removeComponent(container.getComponent(f.ComponentMaterial));
            container.addComponent(new f.ComponentMaterial(ComponentScriptEnemie.mtrEnemie));
        }
    }
}