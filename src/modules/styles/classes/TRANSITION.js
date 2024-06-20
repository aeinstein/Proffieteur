class TRANSITION extends STYLE {
    getType() {
        return "TRANSITION";
    }

    IS_RUNNING() {
        return !this.done();
    }
}