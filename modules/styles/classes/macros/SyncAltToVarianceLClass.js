
class SyncAltToVarianceLClass extends MACRO {
    constructor() {
        super("Invisble layer for synchronizing Alt and Variance.", arguments);
        this.SetExpansion(AlphaL(BLACK, SyncAltToVarianceF()));
    }
}

function SyncAltToVarianceL() {
    return new SyncAltToVarianceLClass();
}