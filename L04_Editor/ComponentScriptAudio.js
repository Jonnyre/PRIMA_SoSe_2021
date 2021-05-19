"use strict";
var L04_Editor;
(function (L04_Editor) {
    var f = FudgeCore;
    f.Project.registerScriptNamespace(L04_Editor);
    class ComponentScriptAudio extends f.ComponentScript {
        constructor() {
            super();
            f.Time.game.setTimer(8000, 0, this.hndTimer.bind(this));
        }
        hndTimer(_event) {
            let cmpAudio = this.getContainer().getComponent(f.ComponentAudio);
            cmpAudio.play(true);
        }
    }
    L04_Editor.ComponentScriptAudio = ComponentScriptAudio;
})(L04_Editor || (L04_Editor = {}));
//# sourceMappingURL=ComponentScriptAudio.js.map