namespace Endabgabe {
    import fui = FudgeUserInterface;
  
    class GameState extends ƒ.Mutable {
      public weapon: string = "Sword";
      protected reduceMutator(_mutator: ƒ.Mutator): void {/* */ }
    }
  
    export let gameState: GameState = new GameState();
  
    export class Hud {
      private static controller: fui.Controller;
  
      public static start(): void {
        let domHud: HTMLDivElement = document.querySelector("div");
        Hud.controller = new fui.Controller(gameState, domHud);
        Hud.controller.updateUserInterface();
      }
    }
  }