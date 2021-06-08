"use strict";
var Endabgabe;
(function (Endabgabe) {
    var fui = FudgeUserInterface;
    class GameState extends ƒ.Mutable {
        constructor() {
            super(...arguments);
            this.weapon = "Sword";
        }
        reduceMutator(_mutator) { }
    }
    Endabgabe.gameState = new GameState();
    class Hud {
        static start() {
            let domHud = document.querySelector("div");
            Hud.controller = new fui.Controller(Endabgabe.gameState, domHud);
            Hud.controller.updateUserInterface();
        }
    }
    Endabgabe.Hud = Hud;
})(Endabgabe || (Endabgabe = {}));
//# sourceMappingURL=Hud.js.map