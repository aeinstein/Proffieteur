class MACRO extends STYLE {
    SetExpansion(expansion) {
        this.expansion = expansion;
    }

    run(blade) {
        this.expansion.run(blade);
    }

    getInteger(led) {
        return this.expansion.getInteger(led);
    }

    getColor(A, B, C) {
        return this.expansion.getColor(A, B, C);
    }

    getType() {
        return this.expansion.getType();
    }

    isMacro() {
        return true;
    }

    isEffect() {
        return this.expansion.isEffect();
    }

    begin() {
        this.expansion.begin();
    }

    done() {
        return this.expansion.done();
    }

    IS_RUNNING() {
        if (this.expansion.IS_RUNNING)
            return this.expansion.IS_RUNNING();
        return false;
    }

    bend(t, len, scale) {
        if (this.expansion.bend)
            return this.expansion.bend(t, len, scale);
        return scale * t / len;
    }
}
