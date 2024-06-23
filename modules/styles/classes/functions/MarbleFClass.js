class MarbleFClass extends FUNCTION {
    constructor(OFFSET, FRICTION, ACCELERATION, GRAVITY) {
        super("Circular marble simulator.", arguments);
        this.add_arg("OFFSET", "FUNCTION", "Offset");
        this.add_arg("FRICTION", "FUNCTION", "Friction");
        this.add_arg("ACCELERATION", "FUNCTION", "Acceleration");
        this.add_arg("GRAVITY", "FUNCTION", "Gravity");
        this.last_micros = 0;
        this.pos = 0;
        this.value = 0;
        this.pos = 0.0;
        this.speed = 0.0;
    }

    run(blade) {
        super.run(blade);
        var now = micros();
        var delta = now - this.last_micros;
        this.last_micros = now;
        if (delta > 1000000) delta = 1;
        var fraction = delta / 1000000.0;
        var rad = (this.pos + this.OFFSET.getInteger(0) / 32768.0) * Math.PI * 2.0;
        var down = {x: 0.0, y: 1.0, z: 0.0};
        var gravity = this.GRAVITY.getInteger(0) / 32768.0;
        var accel = (down.y * Math.sin(rad) + down.z * Math.cos(rad)) * gravity;
        accel += this.ACCELERATION.getInteger(0) / 32768.0;
        accel -= this.speed * this.FRICTION.getInteger(0) / 32768.0;
        this.speed += accel * fraction;
        this.pos = fract(this.pos + this.speed * fraction);
        this.value = this.pos * 32768.0;
    }

    getInteger(led) {
        return this.value;
    }
};

function MarbleF(OFFSET, FRICTION, ACCELERATION, GRAVITY) {
    return new MarbleFClass(OFFSET, FRICTION, ACCELERATION, GRAVITY);
}