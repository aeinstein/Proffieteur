class LockupClass extends MACRO {
    constructor(BASE, LOCKUP, DRAG_COLOR, LOCKUP_SHAPE, DRAG_SHAPE) {
        super("Implements the lockup and drag effects.", arguments);
        this.add_arg("BASE", "COLOR", "base color");
        this.add_arg("LOCKUP", "COLOR", "lockup color");
        this.add_arg("DRAG_COLOR", "COLOR", "drag color", this.LOCKUP.DOCOPY());
        this.add_arg("LOCKUP_SHAPE", "FUNCTION", "Lockup shape", Int(32768));
        this.add_arg("DRAG_SHAPE", "FUNCTION", "Drag shape", SmoothStep(Int(28671), Int(4096)));
        this.SetExpansion(Layers(BASE, LockupL(LOCKUP, DRAG_COLOR, LOCKUP_SHAPE, DRAG_SHAPE)));
    }
};

function Lockup(BASE, LOCKUP, DRAG, LOCKUP_SHAPE, DRAG_SHAPE) {
    return new LockupClass(BASE, LOCKUP, DRAG, LOCKUP_SHAPE, DRAG_SHAPE);
}