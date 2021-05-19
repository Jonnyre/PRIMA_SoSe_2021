namespace L04_Editor {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(L04_Editor);

    export class ComponentScriptJump extends f.ComponentScript {
        constructor() {
            super();
            f.Time.game.setTimer(500, 0, this.hndTimer.bind(this));
        }

        private hndTimer(_event: CustomEvent): void {
            let body: f.ComponentRigidbody = this.getContainer().getComponent(f.ComponentRigidbody);
            body.applyLinearImpulse(f.Vector3.Y(3));
        }
    }
}