"use strict";
var L04_Editor;
(function (L04_Editor) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(L04_Editor);
    class ComponentScriptMove extends f.ComponentScript {
        constructor() {
            super();
            console.log("heeeello");
            f.Time.game.setTimer(500, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            let body = this.getContainer().getComponent(f.ComponentRigidbody);
            body.applyLinearImpulse(f.Vector3.Z(10));
        }
    }
    L04_Editor.ComponentScriptMove = ComponentScriptMove;
})(L04_Editor || (L04_Editor = {}));
//# sourceMappingURL=ComponentScriptMove.js.map