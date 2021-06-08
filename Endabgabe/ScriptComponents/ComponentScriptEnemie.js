"use strict";
var Endabgabe;
(function (Endabgabe) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(Endabgabe);
    class ComponentScriptEnemie extends f.ComponentScript {
        constructor() {
            super();
            f.Time.game.setTimer(500, 1, this.addMtr.bind(this));
        }
        addMtr(_event) {
            let container = this.getContainer();
            container.removeComponent(container.getComponent(f.ComponentMaterial));
            container.addComponent(new f.ComponentMaterial(ComponentScriptEnemie.mtrEnemie));
        }
    }
    ComponentScriptEnemie.textureEnemie = new f.TextureImage("./Assets/Ghost.png");
    ComponentScriptEnemie.mtrEnemie = new f.Material("Arrow", f.ShaderTexture, new f.CoatTextured(f.Color.CSS("White"), ComponentScriptEnemie.textureEnemie));
    Endabgabe.ComponentScriptEnemie = ComponentScriptEnemie;
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=ComponentScriptEnemie.js.map