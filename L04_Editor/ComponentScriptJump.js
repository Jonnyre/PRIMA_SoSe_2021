"use strict";
var L04_Editor;
(function (L04_Editor) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(L04_Editor);
    class ComponentScriptJump extends f.ComponentScript {
        constructor() {
            super();
            f.Time.game.setTimer(500, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            let body = this.getContainer().getComponent(f.ComponentRigidbody);
            body.applyLinearImpulse(f.Vector3.Y(3));
        }
    }
    L04_Editor.ComponentScriptJump = ComponentScriptJump;
})(L04_Editor || (L04_Editor = {}));
//# sourceMappingURL=ComponentScriptJump.js.map