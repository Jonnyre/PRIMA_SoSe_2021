namespace L04_Editor {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(L04_Editor);

    export class ComponentScriptAudio extends f.ComponentScript {
        constructor() {
            super();
            f.Time.game.setTimer(8000, 0, this.hndTimer.bind(this));
        }

        private hndTimer(_event: CustomEvent): void {
            let cmpAudio: f.ComponentAudio = this.getContainer().getComponent(f.ComponentAudio);
            cmpAudio.play(true);
        }
    }
}