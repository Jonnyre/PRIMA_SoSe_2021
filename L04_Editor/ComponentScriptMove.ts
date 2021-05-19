namespace L04_Editor {
    import f = FudgeCore;
    f.Project.registerScriptNamespace(L04_Editor);

    export class ComponentScriptMove extends f.ComponentScript {
        constructor() {
            super();
            console.log("heeeello");
            f.Time.game.setTimer(500, 0, this.hndTimer.bind(this));
        }

        private hndTimer(_event: CustomEvent): void {
            let body: f.ComponentRigidbody = this.getContainer().getComponent(f.ComponentRigidbody);
            body.applyLinearImpulse(f.Vector3.Z(10));
        }
    }
}