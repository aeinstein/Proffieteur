let gl = null;
let shaderProgram = null;
const t = 0.0;

let width;
let height;


//var qlinks = "<b>Colors</b> <input type=color id=COLOR value='#ff0000' onclick='ClickColor()' />";
//var effect_links = "<b>Effects:</b>";
//var layer_links = "";
//var effect_type_links = "<b>Effect Types:</b>";
//var template_links = "<b>Templates:</b>";
//var function_links = "<b>Functions:</b>";
//var transition_links = "<b>Transitions:</b>";
const qlinks = [];

const effect_links = [];

const layer_links = [];

const template_links = [];

const function_links = [];

const transition_links = [];

// Create n textures of about 1MB each.
function initGL() {
    AddTab("color", "Styles", effect_links.sort().join(""))
    AddTab("rgb", "Colors",
        qlinks.sort().join("") +
        "<div class='custom-color'>" +
        "<label for='COLOR'>Custom color </label>" +
        "<input type='color' id='COLOR' value='#ff0000' class='color-picker' onclick='ClickColor()' /></div>");
    AddTab("layer", "Layers", layer_links.sort().join(""));
    AddTab("function", "Functions", function_links.sort().join(""));
    AddTab("transition", "Transitions", transition_links.sort().join(""));
    AddTab("effect", "Effects");
    AddTab("lockup_type", "Lockup Types");
    AddTab("arguments", "Arguments");
    AddTab("example", "Examples", template_links.join(""));
    AddTab("history", "History");
    AddTab("arg_string", "ArgString");
    EFFECT_ENUM_BUILDER.addToTab("effect", "EFFECT_");
    LOCKUP_ENUM_BUILDER.addToTab("lockup_type", "LOCKUP_");
    ArgumentName_ENUM_BUILDER.addToTab("arguments", "");

// Add arg string.
    let A = "";
    A += "Arg string: <input id=ARGSTR name=arg type=input size=80 value='builtin 0 1' onchange='ArgStringChanged()' /><br><table>";
    const v = Object.keys(ArgumentName_ENUM_BUILDER.value_to_name);
    for (let i = 0; i < v.length; i++) {
        const V = parseInt(v[i]);
        const N = ArgumentName_ENUM_BUILDER.value_to_name[V];
        A += "<tr><td>" + N + "</td><td>";
        if (N.search("COLOR") >= 0) {
            A += "<input type=color id=ARGSTR_" + N + " onclick='ClickArgColor(" + N + ")' onchange='ClickArgColor(" + N + ")' >";
        } else {
            A += "<input type=button value='<'  onclick='IncreaseArg(" + N + ",-1)' >";
            A += "<input id=ARGSTR_" + N + " type=input size=6 value=0 onchange='ArgChanged(" + N + ")' >";
            A += "<input type=button value='>'  onclick='IncreaseArg(" + N + ",1)' >";
        }

        A += "</td></tr>\n";
    }

    A += "</table\n";
    AddTabContent("arg_string", A);


    const canvas = FIND("canvas_id");

    width = window.innerWidth;
    height = window.innerHeight;

    if (window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    } else {
        dpr = 1;
    }

    width = width * 2 / 3;
    height /= 3;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    let enlargeCanvas = false;

    FIND('ENLARGE').onclick = function () {
        enlargeCanvas = !enlargeCanvas;
        this.innerText = enlargeCanvas ? 'Reduce' : 'Enlarge';

        if (enlargeCanvas) {
            height = window.innerHeight / 2;
        } else {
            height = window.innerHeight / 3;
        }

// Update the canvas dimensions
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }

    gl = canvas.getContext("experimental-webgl", {colorSpace: "srgb", antialias: false});

    if (!gl) {
        throw "Unable to fetch WebGL rendering context for Canvas";
    }

    let str = new URL(window.location.href).searchParams.get("S");

    if (!str) {
        str = "Layers<Red,ResponsiveLockupL<White,TrInstant,TrFade<100>,Int<26000>>,ResponsiveLightningBlockL<White>,ResponsiveMeltL<Mix<TwistAngle<>,Red,Yellow>>,ResponsiveDragL<White>,ResponsiveClashL<White,TrInstant,TrFade<200>,Int<26000>>,ResponsiveBlastL<White>,ResponsiveBlastWaveL<White>,ResponsiveBlastFadeL<White>,ResponsiveStabL<White>,InOutTrL<TrWipe<300>,TrWipeIn<500>>>";
    }
    FIND("style").value = str;

    Run();
    DoLayerize();

//FIND("color_links").innerHTML = qlinks;
//FIND("effect_links").innerHTML = effect_links;
//FIND("effect_type_links").innerHTML = effect_type_links;
//FIND("template_links").innerHTML = template_links;
//FIND("function_links").innerHTML = function_links;
//FIND("transition_links").innerHTML = transition_links;

// Bind a vertex buffer with a single triangle
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const bufferData = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);

    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(shaderProgram.a_position);
    gl.vertexAttribPointer(shaderProgram.a_position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

// Start the event loop.
    tick();
}

class Matrix {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.values = new Float32Array(w * h);
        if (w === h) {
            for (let z = 0; z < w; z++) {
                this.set(z, z, 1.0);
            }
        }
    }

    get(x, y) {
        return this.values[y * this.w + x];
    }

    set(x, y, v) {
        this.values[y * this.w + x] = v;
    }

    mult(o) {
        var ret = new Matrix(o.w, this.h);
        for (var x = 0; x < o.w; x++) {
            for (var y = 0; y < this.h; y++) {
                var sum = 0.0;
                for (var z = 0; z < this.w; z++) {
                    sum += this.get(z, y) * o.get(x, z);
                }
                ret.set(x, y, sum);
            }
        }
        return ret;
    }

    static mkzrot(a) {
        const ret = new Matrix(4, 4);
        const s = Math.sin(a);
        const c = Math.cos(a);
        ret.set(0, 0, c);
        ret.set(1, 1, c);
        ret.set(0, 1, s);
        ret.set(1, 0, -s);
        return ret;
    }

    static mkxrot(a) {
        const ret = new Matrix(4, 4);
        const s = Math.sin(a);
        const c = Math.cos(a);
        ret.set(1, 1, c);
        ret.set(2, 2, c);
        ret.set(1, 2, s);
        ret.set(2, 1, -s);
        return ret;
    }

    static mkyrot(a) {
        const ret = new Matrix(4, 4);
        const s = Math.sin(a);
        const c = Math.cos(a);
        ret.set(0, 0, c);
        ret.set(2, 2, c);
        ret.set(0, 2, s);
        ret.set(2, 0, -s);
        return ret;
    }

    static mktranslate(x, y, z) {
        const ret = new Matrix(4, 4);
        ret.set(0, 3, x);
        ret.set(1, 3, y);
        ret.set(2, 3, z);
        return ret;
    }

    tostr() {
        let ret = "{";
        for (let x = 0; x < this.w; x++) {
            for (let y = 0; y < this.h; y++) {
                ret += this.get(x, y);
                ret += ", ";
            }
            ret += ";";
        }
        ret += "}";
        return ret;
    }
}

function default_move_matrix() {
    return Matrix.mktranslate(-0.023, 0.0, -0.12);
}

let MOVE_MATRIX = default_move_matrix();
const OLD_MOVE_MATRIX = default_move_matrix();
let MOUSE_POSITIONS = [];
let IN_FRAME = false;
let BLADE_ANGLE = 0.0;

function mouse_speed(t1, t2) {
    const dx = MOUSE_POSITIONS[t1 + 0] - MOUSE_POSITIONS[t2 + 0];
    const dy = MOUSE_POSITIONS[t1 + 1] - MOUSE_POSITIONS[t2 + 1];
    const dt = MOUSE_POSITIONS[t1 + 2] - MOUSE_POSITIONS[t2 + 2];
    if (dt === 0) return 0.0;
    return Math.sqrt(dx * dx + dy * dy) / Math.abs(dt);
}

const min = Math.min;

function mouse_move(e) {
    if (mouseswingsState.get()) return;
    IN_FRAME = true;
    const canvas = FIND("canvas_id");
    const rect = canvas.getBoundingClientRect();
    const w = rect.right - rect.left;
    const h = rect.bottom - rect.top;
    const d = min(h, w);
    const x = (e.clientX - (rect.left + rect.right) / 2.0) / d;
    const y = (e.clientY - (rect.top + rect.bottom) / 2.0) / d;
    const now = actual_millis();
    MOUSE_POSITIONS = MOUSE_POSITIONS.concat([x * 10000, y * 10000, now])

    while (MOUSE_POSITIONS.length > 0 && now - MOUSE_POSITIONS[2] > 100) {
        MOUSE_POSITIONS = MOUSE_POSITIONS.slice(3);
    }

//  console.log("x = "+x+" y = "+y);
    if (e.shiftKey) {
        MOVE_MATRIX = default_move_matrix();
    } else {
        BLADE_ANGLE = -y;
        MOVE_MATRIX = Matrix.mkzrot(Math.PI / 2.0).mult(Matrix.mkxrot(-y)).mult(Matrix.mkzrot(y));

        MOVE_MATRIX = Matrix.mkyrot(Math.PI / 2.0)
        MOVE_MATRIX = MOVE_MATRIX.mult(Matrix.mktranslate(1.0, 0.04, 0.0));
        MOVE_MATRIX = MOVE_MATRIX.mult(Matrix.mkyrot(-x / 3));
        MOVE_MATRIX = MOVE_MATRIX.mult(Matrix.mktranslate(-1.0, 0.0, 0.0));
        MOVE_MATRIX = MOVE_MATRIX.mult(Matrix.mkzrot(-y));
        MOVE_MATRIX = MOVE_MATRIX.mult(Matrix.mktranslate(-0.17, 0.0, 0.0));
    }
//  console.log(MOVE_MATRIX.values);
}

function get_swing_speed() {
    const now = actual_millis();

    while (MOUSE_POSITIONS.length > 0 && now - MOUSE_POSITIONS[2] > 100) {
        MOUSE_POSITIONS = MOUSE_POSITIONS.slice(3);
    }

    const len = MOUSE_POSITIONS.length;
    if (len >= 6) {
        return mouse_speed(0, len - 6);
    }

    if (IN_FRAME || !autoswingState.get()) return 0.0;
    return Math.sin(millis() * Math.PI / 1000.0) * 250 + 250
}

function get_swing_accel() {
    const now = actual_millis();

    while (MOUSE_POSITIONS.length > 0 && now - MOUSE_POSITIONS[2] > 100) {
        MOUSE_POSITIONS = MOUSE_POSITIONS.slice(3);
    }

    const len = MOUSE_POSITIONS.length;
    if (len >= 6) {
        const speed = mouse_speed(0, len - 6);
        if (MOUSE_POSITIONS.length >= 9) {
            return (speed - mouse_speed(0, Math.floor(len / 6) * 3)) * 2.0;
        }
    }
    if (IN_FRAME) return 0.0;
    return Math.cos(millis() * Math.PI / 500.0) * 100 + 100
}

function mouse_leave(e) {
    console.log("Mouse leave!");
    MOVE_MATRIX = default_move_matrix();
    MOUSE_POSITIONS = [];
    IN_FRAME = false;
}

let variables;

function compile() {
// Create a shader that samples a 2D image.
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,
        FIND("vertex_shader").textContent);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    let shader_code = FIND("fragment_shader").textContent;

    variables = [];
//  shader_code = shader_code.replace("$FUNCTION$", current_style.gencode());
    shader_code = shader_code.replace("$VARIABLES$", variables.join("\n"));
    if (graflexState.get()) {
        shader_code = shader_code.replace("$HILT$", FIND("hilt_graflex").textContent);
    } else {
        shader_code = shader_code.replace("$HILT$", FIND("hilt_cylinder").textContent);
    }
// console.log(shader_code);

    gl.shaderSource(fragmentShader, shader_code);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {

        const v = shader_code.split("\n");
        for (let i = 0; i < v.length; i++) {
            console.log((i + 1) + ": " + v[i]);
        }
        throw "Could not compile shader:\n\n" + gl.getShaderInfoLog(fragmentShader);
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        throw "Could not link the shader program!\n\n" + gl.getProgramInfoLog(shaderProgram);
    }
    gl.useProgram(shaderProgram);

}

let varnum = 0;
variables = [];
const vartypes = {};

function genvar(t) {
    varnum++;
    const variable = "u_" + varnum;
    variables.push("uniform " + t + " " + variable + ";");
    vartypes[variable] = t;
    return variable;
}

function setvar(variable, val) {
// console.log(variable + " = " + val);
    if (vartypes[variable] === "float") {
        gl.uniform1f(gl.getUniformLocation(shaderProgram, variable), val);
        return;
    }
    if (vartypes[variable] === "int") {
        gl.uniform1i(gl.getUniformLocation(shaderProgram, variable), val);
        return;
    }
    console.log("SETVAR ERROR " + variable);
}



function Arg(expected_type, arg, default_arg) {
//console.log("ARGUMENT: " + expected_type);
//console.log(arg);
//if (typeof(arg) == "object") console.log(arg.ID);
//console.log(default_arg);
    if (arg == undefined) {
        if (typeof (default_arg) == "number") {
// console.log("DEFAULT ARG" + default_arg);
            return new INTEGER(default_arg);
        }
        if (default_arg != undefined) {
// This must copy the argument!
            return default_arg;
        }
        throw "Too few arguments";
    }
    if (typeof (arg) != "number" && !arg.getType) {
        throw "What is this?? " + arg;
    }
    if (expected_type === "TIME_FUNCTION" && arg.getType() === "FUNCTION") {
        return arg;
    }
    if (typeof (arg) != "number" && arg.getType() !== expected_type) {
        throw "Expected " + expected_type + " but got " + arg;
    }
    if (expected_type === "INT" && typeof (arg) == "number") {
        return new INTEGER(arg);
    }
    if (expected_type === "INT" || expected_type === "EFFECT" || expected_type === "LOCKUP_TYPE" || expected_type === "ArgumentName") {
        return arg;
    }
    if (expected_type === "COLOR" ||
        expected_type === "FireConfig" ||
        expected_type === "TRANSITION" ||
        expected_type === "FUNCTION" ||
        expected_type === "TIME_FUNCTION") {
        if (typeof (arg) != "object") {
            throw "Expected a " + expected_type;
        }
        return arg;
    }

    throw "Not INT, COLOR, EFFECT, LOCKUP_TYPE, FUNCTION or TRANSITION";
}

function IntArg(arg, def_arg) {
    return Arg("INT", arg, def_arg);
}

function ColorArg(arg, def_arg) {
    return Arg("COLOR", arg, def_arg);
}

let pp_is_url = 0;
const pp_is_verbose = 0;

let next_id = 1000;
const style_ids = {};

const identifiers = {};

function AddIdentifier(name, value) {
    identifiers[name] = value;
}

function INT(x) {
    return new INTEGER(x);
}


function AddEnum(enum_type, name, value) {
    if (value == undefined) {
        value = enum_type.last_value + 1;
    }
    enum_type.last_value = value;
    enum_type.value_to_name[value] = name;
    window[name] = value;
    AddIdentifier(name, function () {
        return new enum_type(value);
    });
    console.log(" ENUM " + name + " = " + value);
}

import EnumBuilder from "classes/EnumBuilder";

const EFFECT_ENUM_BUILDER = new EnumBuilder("EFFECT");
EFFECT_ENUM_BUILDER.addValue("EFFECT_NONE", 0);
EFFECT_ENUM_BUILDER.addValue("EFFECT_CLASH");
EFFECT_ENUM_BUILDER.addValue("EFFECT_BLAST");
EFFECT_ENUM_BUILDER.addValue("EFFECT_FORCE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_STAB");
EFFECT_ENUM_BUILDER.addValue("EFFECT_BOOT");
EFFECT_ENUM_BUILDER.addValue("EFFECT_LOCKUP_BEGIN");
EFFECT_ENUM_BUILDER.addValue("EFFECT_LOCKUP_END");
EFFECT_ENUM_BUILDER.addValue("EFFECT_DRAG_BEGIN");
EFFECT_ENUM_BUILDER.addValue("EFFECT_DRAG_END");
EFFECT_ENUM_BUILDER.addValue("EFFECT_PREON");
EFFECT_ENUM_BUILDER.addValue("EFFECT_POSTOFF");
EFFECT_ENUM_BUILDER.addValue("EFFECT_IGNITION");
EFFECT_ENUM_BUILDER.addValue("EFFECT_RETRACTION");
EFFECT_ENUM_BUILDER.addValue("EFFECT_CHANGE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_NEWFONT");
EFFECT_ENUM_BUILDER.addValue("EFFECT_LOW_BATTERY");
EFFECT_ENUM_BUILDER.addValue("EFFECT_POWERSAVE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_BATTERY_LEVEL");
EFFECT_ENUM_BUILDER.addValue("EFFECT_VOLUME_LEVEL");
EFFECT_ENUM_BUILDER.addValue("EFFECT_ON");
EFFECT_ENUM_BUILDER.addValue("EFFECT_FAST_ON");
EFFECT_ENUM_BUILDER.addValue("EFFECT_QUOTE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_SECONDARY_IGNITION");
EFFECT_ENUM_BUILDER.addValue("EFFECT_SECONDARY_RETRACTION");
EFFECT_ENUM_BUILDER.addValue("EFFECT_OFF");
EFFECT_ENUM_BUILDER.addValue("EFFECT_FAST_OFF");
EFFECT_ENUM_BUILDER.addValue("EFFECT_OFF_CLASH");
EFFECT_ENUM_BUILDER.addValue("EFFECT_NEXT_QUOTE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_INTERACTIVE_PREON");
EFFECT_ENUM_BUILDER.addValue("EFFECT_INTERACTIVE_BLAST");
EFFECT_ENUM_BUILDER.addValue("EFFECT_TRACK");
EFFECT_ENUM_BUILDER.addValue("EFFECT_BEGIN_BATTLE_MODE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_END_BATTLE_MODE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_BEGIN_AUTO_BLAST");
EFFECT_ENUM_BUILDER.addValue("EFFECT_END_AUTO_BLAST");
EFFECT_ENUM_BUILDER.addValue("EFFECT_ALT_SOUND");
EFFECT_ENUM_BUILDER.addValue("EFFECT_TRANSITION_SOUND");
EFFECT_ENUM_BUILDER.addValue("EFFECT_SOUND_LOOP");
EFFECT_ENUM_BUILDER.addValue("EFFECT_STUN");
EFFECT_ENUM_BUILDER.addValue("EFFECT_FIRE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_CLIP_IN");
EFFECT_ENUM_BUILDER.addValue("EFFECT_CLIP_OUT");
EFFECT_ENUM_BUILDER.addValue("EFFECT_RELOAD");
EFFECT_ENUM_BUILDER.addValue("EFFECT_MODE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_RANGE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_EMPTY");
EFFECT_ENUM_BUILDER.addValue("EFFECT_FULL");
EFFECT_ENUM_BUILDER.addValue("EFFECT_JAM");
EFFECT_ENUM_BUILDER.addValue("EFFECT_UNJAM");
EFFECT_ENUM_BUILDER.addValue("EFFECT_PLI_ON");
EFFECT_ENUM_BUILDER.addValue("EFFECT_PLI_OFF");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_START");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_ACTION1");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_ACTION2");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_CHOICE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_RESPONSE1");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_RESPONSE2");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_RESULT1");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_RESULT2");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_WIN");
EFFECT_ENUM_BUILDER.addValue("EFFECT_GAME_LOSE");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER1");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER2");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER3");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER4");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER5");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER6");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER7");
EFFECT_ENUM_BUILDER.addValue("EFFECT_USER8");
EFFECT_ENUM_BUILDER.addValue("EFFECT_SD_CARD_NOT_FOUND");
EFFECT_ENUM_BUILDER.addValue("EFFECT_ERROR_IN_FONT_DIRECTORY");
EFFECT_ENUM_BUILDER.addValue("EFFECT_ERROR_IN_BLADE_ARRAY");
EFFECT_ENUM_BUILDER.addValue("EFFECT_FONT_DIRECTORY_NOT_FOUND");
EFFECT_ENUM_BUILDER.build();

LOCKUP_ENUM_BUILDER = new EnumBuilder("LOCKUP_TYPE", "SaberBase::");
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_NONE", 0);
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_NORMAL");
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_DRAG");
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_ARMED");
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_AUTOFIRE");
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_MELT");
LOCKUP_ENUM_BUILDER.addValue("LOCKUP_LIGHTNING_BLOCK");
LOCKUP_ENUM_BUILDER.build();

ArgumentName_ENUM_BUILDER = new EnumBuilder("ArgumentName");
ArgumentName_ENUM_BUILDER.addValue("BASE_COLOR_ARG", 1);
ArgumentName_ENUM_BUILDER.addValue("ALT_COLOR_ARG", 2);
ArgumentName_ENUM_BUILDER.addValue("STYLE_OPTION_ARG", 3);
ArgumentName_ENUM_BUILDER.addValue("IGNITION_OPTION_ARG", 4);
ArgumentName_ENUM_BUILDER.addValue("IGNITION_TIME_ARG", 5);
ArgumentName_ENUM_BUILDER.addValue("IGNITION_DELAY_ARG", 6);
ArgumentName_ENUM_BUILDER.addValue("IGNITION_COLOR_ARG", 7);
ArgumentName_ENUM_BUILDER.addValue("IGNITION_POWER_UP_ARG", 8);
ArgumentName_ENUM_BUILDER.addValue("BLAST_COLOR_ARG", 9);
ArgumentName_ENUM_BUILDER.addValue("CLASH_COLOR_ARG", 10);
ArgumentName_ENUM_BUILDER.addValue("LOCKUP_COLOR_ARG", 11);
ArgumentName_ENUM_BUILDER.addValue("LOCKUP_POSITION_ARG", 12);
ArgumentName_ENUM_BUILDER.addValue("DRAG_COLOR_ARG", 13);
ArgumentName_ENUM_BUILDER.addValue("DRAG_SIZE_ARG", 14);
ArgumentName_ENUM_BUILDER.addValue("LB_COLOR_ARG", 15);
ArgumentName_ENUM_BUILDER.addValue("STAB_COLOR_ARG", 16);
ArgumentName_ENUM_BUILDER.addValue("MELT_SIZE_ARG", 17);
ArgumentName_ENUM_BUILDER.addValue("SWING_COLOR_ARG", 18);
ArgumentName_ENUM_BUILDER.addValue("SWING_OPTION_ARG", 19);
ArgumentName_ENUM_BUILDER.addValue("EMITTER_COLOR_ARG", 20);
ArgumentName_ENUM_BUILDER.addValue("EMITTER_SIZE_ARG", 21);
ArgumentName_ENUM_BUILDER.addValue("PREON_COLOR_ARG", 22);
ArgumentName_ENUM_BUILDER.addValue("PREON_OPTION_ARG", 23);
ArgumentName_ENUM_BUILDER.addValue("PREON_SIZE_ARG", 24);
ArgumentName_ENUM_BUILDER.addValue("RETRACTION_OPTION_ARG", 25);
ArgumentName_ENUM_BUILDER.addValue("RETRACTION_TIME_ARG", 26);
ArgumentName_ENUM_BUILDER.addValue("RETRACTION_DELAY_ARG", 27);
ArgumentName_ENUM_BUILDER.addValue("RETRACTION_COLOR_ARG", 28);
ArgumentName_ENUM_BUILDER.addValue("RETRACTION_COOL_DOWN_ARG", 29);
ArgumentName_ENUM_BUILDER.addValue("POSTOFF_COLOR_ARG", 30);
ArgumentName_ENUM_BUILDER.addValue("OFF_COLOR_ARG", 31);
ArgumentName_ENUM_BUILDER.addValue("OFF_OPTION_ARG", 32);
ArgumentName_ENUM_BUILDER.addValue("ALT_COLOR2_ARG", 33);
ArgumentName_ENUM_BUILDER.addValue("ALT_COLOR3_ARG", 34);
ArgumentName_ENUM_BUILDER.addValue("STYLE_OPTION2_ARG", 35);
ArgumentName_ENUM_BUILDER.addValue("STYLE_OPTION3_ARG", 36);
ArgumentName_ENUM_BUILDER.addValue("IGNITION_OPTION2_ARG", 37);
ArgumentName_ENUM_BUILDER.addValue("RETRACTION_OPTION2_ARG", 38);
ArgumentName_ENUM_BUILDER.build();

function effect_to_argument(effect) {
    switch (effect + 0) {
        case EFFECT_CLASH:
            return CLASH_COLOR_ARG;
        case EFFECT_BLAST:
            return BLAST_COLOR_ARG;
        case EFFECT_STAB:
            return STAB_COLOR_ARG;
        case EFFECT_PREON:
            return PREON_COLOR_ARG;
        case EFFECT_POSTOFF:
            return POSTOFF_COLOR_ARG;
    }
    return undefined;
}

function lockup_to_argument(effect) {
    switch (effect + 0) {
        case LOCKUP_NORMAL:
            return LOCKUP_COLOR_ARG;
        case LOCKUP_DRAG:
            return DRAG_COLOR_ARG;
        case LOCKUP_LIGHTNING_BLOCK:
            return LB_COLOR_ARG;
    }
    return undefined;
}


function FixColor(c) {
    return min(65535, Math.floor(Math.pow(parseInt(c, 16) / 255.0, 2.2) * 65536));
}

function hex2(N) {
    let ret = N.toString(16);
    if (ret.length < 2) ret = "0" + ret;
    return ret;
}

function UnFixColor(c) {
    return hex2(min(255, Math.floor(Math.pow(parseInt(c) / 65535.0, 1.0 / 2.2) * 255)));
}

function ClickColor() {
    const color_button = FIND("COLOR");

    color_button.addEventListener("input", ClickColor, false);
    const R = FixColor(color_button.value.substr(1, 2));
    const G = FixColor(color_button.value.substr(3, 2));
    const B = FixColor(color_button.value.substr(5, 2));
    SetTo("Rgb16<" + R + "," + G + "," + B + ">");
}

const effect_type_links = [];

const all_colors = {};
const colorNames = {};


function f(n, C, MAX) {
    const k = n % 6;
    const x = MAX - C * clamp(min(k, 4 - k), 0, 1);
    return x * 255.0;
}

function Rgb(r, g, b) {
    return new RgbClass(r, g, b);
}

function Transparent(r, g, b) {
    const ret = Rgb(0, 0, 0);
    ret.a = 0.0;
    return ret;
}


function RgbF(r, g, b) {
    return new Rgb16Class(r * 65535, g * 65535, b * 65535);
}


function ReplaceNode(old_node, new_node) {
    FocusOnLow(old_node.get_id());
    pp_is_url++;
    FIND("style").value = new_node.pp();
    pp_is_url--;
    Run();
}

function DuplicateLayer(id, arg, event) {
    event.stopPropagation();
    console.log("DuplicateLayer: " + id + ", " + arg);
    arg -= 2;
    const layer = style_ids[id];
    const new_layer = new LayersClass([layer.BASE].concat(layer.LAYERS.slice(0, arg), [layer.LAYERS[arg].DOCOPY()], layer.LAYERS.slice(arg)));
    ReplaceNode(layer, new_layer);
}

function RemoveLayer(id, arg, event) {
    event.stopPropagation();
    console.log("RemoveLayer: " + id + ", " + arg);
    arg -= 2;
    const layer = style_ids[id];
    const new_layer = new LayersClass([layer.BASE].concat(layer.LAYERS.slice(0, arg), layer.LAYERS.slice(arg + 1)));
    ReplaceNode(layer, new_layer);
}

function DownLayer(id, arg, event) {
    event.stopPropagation();
    console.log("DownLayer: " + id + ", " + arg);
    arg -= 2;
    const layer = style_ids[id];
    const new_layer = new LayersClass([layer.BASE].concat(layer.LAYERS.slice(0, arg),
        [layer.LAYERS[arg + 1], layer.LAYERS[arg]],
        layer.LAYERS.slice(arg + 2)));
    ReplaceNode(layer, new_layer);
}

function UpLayer(id, arg, event) {
    console.log("UpLayer: " + id + ", " + arg);
    DownLayer(id, arg - 1, event);
}



function enc(s) {
    return s.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function encstr(s) {
    return s.replace("\n", "\\n");
}

function mkbutton2(name, val) {
    return "<input type=button class=btn onclick='SetToAndFormat(\"" + val + "\")' value='" + enc(name) + "'>\n";
//  return "<span class=btn onclick='SetTo(\""+name+"\")'>"+enc(name)+"</span>\n";
}

function mkbutton(name) {
    return mkbutton2(name, name);
//  return "<input type=button class=btn onclick='SetTo(\""+name+"\")' value='"+enc(name)+"'>\n";
//  return "<span class=btn onclick='SetTo(\""+name+"\")'>"+enc(name)+"</span>\n";
}


function AddTemplate(name) {
    const val = name;
    if (name.length > 40) {
        name = name.slice(0, 40) + '...';
    }
    template_links.push(mkbutton2(name, val));
}

function AddEffect(val) {
    const name = val.split("<")[0];
    effect_links.push(mkbutton2(name, val));
}

function AddLayer(val) {
    const name = val.split("<")[0];
    layer_links.push(mkbutton2(name, val));
}

function AddFunction(val) {
    const name = val.split("<")[0];
    function_links.push(mkbutton2(name, val));
}

function AddTransition(val) {
    const name = val.split("<")[0];
    transition_links.push(mkbutton2(name, val));
}

function AddEffectWL(val) {
    AddEffect(val);
    val = val.slice(0, val.length - 1);
    const tmp1 = val.split("<");
    const tmp2 = val.split(",");
    AddLayer(tmp1[0] + "L<" + tmp2.slice(1).join(",") + ">")
}

function AddEffectWLF(val) {
    AddEffect(val);
    val = val.slice(0, val.length - 1);
    const tmp1 = val.split("<");
    const tmp2 = val.split(",");
    AddLayer(tmp1[0] + "L<" + tmp2.slice(1).join(",") + ">")
    AddFunction(tmp1[0] + "F<" + tmp2.slice(2).join(",") + ">")
}

let history_html = "";

function AddHistory(name, type) {
    let label = name;
    if (label.length > 80) label = label.slice(0, 78) + "...";
    name = name.split("\n").join(" ").split("   ").join(" ").split("  ").join(" ").split("< ").join("<");
    const btn = "<input type=button class=btn onclick='SetToAndFormat(\"" + name + "\")' value='" + enc(label) + "'>\n";
    const tag = "<span class=MAGIC_CLASS_" + type + ">" + btn + "</span>\n";
    history_html = tag + history_html.replace(tag, "");
    FIND("history_tabcontent").innerHTML = history_html;
}

function mapcolor(x) {
    x /= 255.0;
    x = Math.pow(x, 1.0 / 2.2);
    return Math.round(x * 255);
}

function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return [h, s, l];
}


function mkcolorbutton(name, r, g, b) {
    r = mapcolor(r);
    g = mapcolor(g);
    b = mapcolor(b);
    const hsl = rgbToHsl(r, g, b);
    console.log("mkcolorbutton:name=" + name + "  rgb=" + r + "," + g + "," + b + "    hsl=" + hsl[0] + "," + hsl[1] + "," + hsl[2] + "  ");
    let sortString;
    if (hsl[1] == 0.0) {
        sortString = "C:" + hsl[2];
    } else if (hsl[1] < 0.3 || hsl[2] > 0.8 || hsl[2] < 0.2) {
        sortString = "B:" + hsl[0];
    } else {
        sortString = "A:" + hsl[0];
    }
    let bgColor = "rgb(" + r + "," + g + "," + b + ")";
    if (r === 0 && g === 0 && b === 0) bgColor = "black"
    const textColor = (name === "Black" || name === "Blue") ? "white" : "black";
    return "<input srt='" + sortString + "' type=button style='border: 1px solid black;padding:8px;color:" + textColor + ";background:" + bgColor + "' class=btn onclick='SetTo(\"" + name + "\")' value='" + enc(name) + "'>\n";
}

function AddColor(name, r, g, b) {
    colorNames[r + "," + g + "," + b] = name;
    qlinks.push(mkcolorbutton(name, r, g, b));
    all_colors[name] = new RgbClass(r, g, b);
}

AddTemplate("InOutHelper<SimpleClash<Lockup<Blast<Blue,White>,AudioFlicker<Blue,White>>,White>, 300, 800>");
// AddTemplate("StyleFirePtr<Red, Yellow>");
AddTemplate("InOutHelper<EasyBlade<OnSpark<Green>, White>, 300, 800>>");
AddTemplate("InOutHelper<EasyBlade<Sparkle<Blue>, White>, 300, 800>>");
AddTemplate("IgnitionDelay<500, InOutHelper<EasyBlade<OnSpark<Green>, White>, 300, 800>>>");
AddTemplate("RetractionDelay<500, InOutHelper<EasyBlade<OnSpark<Green>, White>, 300, 800>>>");
AddTemplate("StyleNormalPtr<AudioFlicker<Yellow, White>, Blue, 300, 800>");
AddTemplate("InOutSparkTip<EasyBlade<Magenta, White>, 300, 800>>");
AddTemplate("StyleNormalPtr<Gradient<Red, Blue>, Gradient<Cyan, Yellow>, 300, 800>");
AddTemplate("StyleNormalPtr<Pulsing<Red, Rgb<50,0,0>, 5000>, White, 300, 800, Red>");
AddTemplate("StyleRainbowPtr<300, 800>");
AddTemplate("StyleStrobePtr<White, Rainbow, 15, 300, 800>");
AddTemplate("StyleFirePtr<Red, Yellow>");
AddTemplate("Layers<Red, ResponsiveLockupL<White, TrInstant, TrFade<100>, Int<26000>, Int<6000>>,ResponsiveLightningBlockL<White, TrInstant, TrInstant>,ResponsiveMeltL<Mix<TwistAngle<>,Red,Yellow>, TrWipeIn<600>, TrWipe<600>, Int<4000>, Int<10000>>,ResponsiveDragL<White, TrInstant, TrInstant, Int<2000>, Int<10000>>,ResponsiveClashL<White, TrInstant, TrFade<200>, Int<26000>, Int<6000>>,ResponsiveBlastL<White, Int<400>, Int<100>, Int<400>, Int<28000>, Int<8000>>,ResponsiveBlastWaveL<White, Int<400>, Int<100>, Int<400>, Int<28000>, Int<8000>>,ResponsiveBlastFadeL<White, Int<8000>, Int<400>, Int<28000>, Int<8000>>,ResponsiveStabL<White, TrWipeIn<600>, TrWipe<600>, Int<14000>, Int<8000>>,InOutTrL<TrWipe<300>, TrWipeIn<500>>>");


AddLayer("AlphaL<Red, Int<16000>>");
AddLayer("AlphaMixL<Bump<Int<16384>,Int<16384>>,Red,Green,Blue>");
AddEffectWL("AudioFlicker<White, Blue>");
AddEffectWLF("Blast<Blue, White>");
AddEffectWL("BlastFadeout<Blue, White>");
AddEffect("Blinking<Red, Blue, 1000, 500>");
AddLayer("BlinkingL<Blue, Int<1000>, Int<500>>");
AddEffect("BrownNoiseFlicker<Green, Magenta, 50>");
AddLayer("BrownNoiseFlickerL<Magenta, Int<50>>");
AddEffect("ColorChange<TrInstant, Red, Green, Blue>");
AddEffect("ColorSelect<Variation, TrInstant, Red, Green, Blue>");
AddFunction("IntSelect<Variation, 0, 8192,32768>");
AddEffect("ColorCycle<Blue,  0, 1, Cyan,  100, 3000, 5000>");
AddEffect("ColorSequence<500, Red, Green, Blue>");
AddEffect("EffectSequence<EFFECT_CLASH, Red, Green, Blue>");
AddEffect("Cylon<Red, 5, 20>");
AddEffect("Gradient<Blue, Green, Yellow, Red>");
AddEffect("Gradient<Red, Blue, Green>");
AddEffect("Gradient<Red, Blue>");
AddEffect("Hue<16384>");
AddEffectWL("HumpFlicker<Green, Magenta, 50>");
AddEffect("InOutHelper<White, 300, 800, Black>");
AddEffect("InOutSparkTip<Red, 1000, 800, White>");
AddEffect("InOutTr<Green, TrColorCycle<3000>, TrFade<500>>");
AddEffect("Layers<Green, AlphaL<Red, Int<16000>>>");
AddEffectWL("LocalizedClash<Red, White>");
AddEffectWL("Lockup<Green, Red>");
AddEffectWL("LockupTr<Red, White, TrFade<100>, TrFade<100>, SaberBase::LOCKUP_MELT>");
AddEffect("Mix<Int<16384>, Red, Blue>");
AddEffect("OnSpark<Green, White, 200>");
AddLayer("OnSparkL<White, Int<200>>");
AddEffectWL("OriginalBlast<Blue, White>");
AddEffect("Pulsing<Blue, Red, 800>");
AddLayer("PulsingL<Red, Int<800>>");
AddEffect("Rainbow");
AddEffect("Remap<SmoothStep<Sin<Int<10>>, Sin<Int<7>>>, Rainbow>");
AddEffect("RandomBlink<3000>");
AddLayer("RandomBlinkL<Int<3000>, Green>");
AddEffect("RandomFlicker<Yellow, Blue>");
AddLayer("RandomL<Blue>");
AddEffectWL("RandomPerLEDFlicker<Green, Magenta>");
AddEffect("Rgb16<0,0,65536>");
AddEffect("Rgb<100,100,100>");
AddEffect("RgbCycle");
AddEffect("RotateColorsX<Variation,Red>");
AddEffect("Sequence<Red, Black, 100, 37, 0b0001010100011100, 0b0111000111000101, 0b0100000000000000>");
AddLayer("SequenceL<Red, 100, 37, 0b0001010100011100, 0b0111000111000101, 0b0100000000000000>");
AddEffectWL("SimpleClash<Red, White, 40>");
AddEffect("Sparkle<Blue>");
AddLayer("SparkleL");
AddEffect("Stripes<1000, 1000, Cyan, Magenta, Yellow, Blue>");
AddEffect("Strobe<Black, White, 15, 1>");
AddLayer("StrobeL<White, Int<15>, Int<1>>");
AddEffect("StyleFire<Blue, Cyan>");
AddEffect("MultiTransitionEffect<Blue, White, TrWipe<50>, TrWipe<50>, EFFECT_BLAST>");
AddEffect("TransitionEffect<Blue,Green,TrFade<500>,TrBoing<500,3>,EFFECT_BLAST>");
AddEffectWL("TransitionLoop<Blue, TrConcat<TrFade<200>, Red, TrFade<200>>>");
AddFunction("BendTimePow<1000, 16384>");
AddFunction("BendTimePowInv<1000, 16384>");
AddFunction("ReverseTime<1000, 16384>");


AddEffect("IgnitionDelay<500, InOutHelper<EasyBlade<OnSpark<Green>, White>, 300, 800>>>");
AddEffect("RetractionDelay<500, InOutHelper<EasyBlade<OnSpark<Green>, White>, 300, 800>>>");


AddLayer("TransitionEffectL<TrConcat<TrWipe<50>, White, TrWipe<50>>, EFFECT_BLAST>");
AddLayer("MultiTransitionEffectL<TrConcat<TrWipe<50>, White, TrWipe<50>>, EFFECT_BLAST>");
AddLayer("TransitionPulseL<TrConcat<TrFade<200>, Red, TrFade<200>>, ThresholdPulseF<Saw<Int<60>>, Int<16384>>>")

AddTransition("TrBoing<300, 2>");
AddTransition("TrBlink<1000, 3>");
AddTransition("TrColorCycle<3000>");
AddTransition("TrConcat<TrFade<100>, White, TrFade<100>>");
AddTransition("TrDelay<500>");
AddTransition("TrFade<300>");
AddTransition("TrInstant");
AddTransition("TrJoin<TrFade<500>, TrWipe<500>>");
AddTransition("TrJoinR<TrFade<500>, TrWipe<500>>");
AddTransition("TrRandom<TrFade<500>, TrWipe<500>, TrBoing<500, 2>>");
AddTransition("TrSelect<Variation,TrFade<500>, TrWipe<500>, TrBoing<500, 2>>");
AddTransition("TrSmoothFade<300>");
AddTransition("TrWipe<500>");
AddTransition("TrWipeIn<500>");
AddTransition("TrCenterWipe<500>");
AddTransition("TrCenterWipeSpark<WHITE, 500>");
AddTransition("TrCenterWipeIn<500>");
AddTransition("TrCenterWipeInSpark<WHITE, 500>");
AddTransition("TrWaveX<White>");
AddTransition("TrSparkX<White>");
AddTransition("TrWipeSparkTip<White, 300>");
AddTransition("TrWipeInSparkTip<White, 300>");
AddTransition("TrWipeSparkTipX<White, Int<300>>");
AddTransition("TrWipeInSparkTipX<White, Int<300>>");
AddTransition("TrExtend<1000, TrFade<500>>");
AddTransition("TrLoop<TrFade<500>>");
AddTransition("TrLoopN<5, TrFade<500>>");
AddTransition("TrLoopUntil<EffectPulseF<EFFECT_CLASH>, TrConcat<TrFade<500>, Green, TrFade<500>>, TrFade<100>>");
AddTransition("TrDoEffect<TrFade<100>, EFFECT_BLAST>");
AddTransition("TrDoEffectAlways<TrFade<100>, EFFECT_BLAST>");

AddFunction("BatteryLevel");
AddFunction("VolumeLevel");
AddFunction("BlinkingF<Int<1000>, Int<500>>");
AddFunction("BrownNoiseF<Int<50>>");
AddFunction("HumpFlickerF<50>");
AddFunction("NoisySoundLevel");
AddFunction("NoisySoundLevelCompat");
AddFunction("SmoothSoundLevel");
AddFunction("SwingSpeed<250>");
AddFunction("SwingAcceleration<130>");
AddFunction("ClashImpactF<>");
AddFunction("Bump<Int<16384>>");
AddFunction("Ifon<Int<0>, Int<32768>>");
AddFunction("IgnitionTime<>");
AddFunction("RetractionTime<>");
AddFunction("InOutFunc<300, 800>");
AddFunction("InOutHelperF<InOutFunc<300, 800>>");
AddFunction("Int<32768>");
AddFunction("Scale<Sin<Int<10>>,Int<0>,Int<4000>>");
AddFunction("InvertF<Ifon<Int<0>, Int<32768>>>");
AddFunction("Sin<Int<10>>");
AddFunction("Saw<Int<10>>");
AddFunction("SmoothStep<Sin<Int<10>>, Sin<Int<7>>>");
AddFunction("Trigger<EFFECT_FORCE, Int<500>, Int<1000>, Int<500>>");
AddFunction("ChangeSlowly<NoisySoundLevel, Int<50000>>");
AddFunction("SlowNoise<Int<1000>>");
AddFunction("IsLessThan<SwingSpeed<250>, Int<100>>");
AddFunction("IsGreaterThan<SwingSpeed<250>, Int<100>>");
AddFunction("IsBetween<SwingSpeed<250>, Int<100>, Int<120>>");
AddFunction("ClampF<RandomPerLEDF, 8000, 12000>");
AddFunction("LayerFunctions<Bump<Int<0>>, Bump<Int<32768>>>");
AddFunction("OnSparkF<Int<200>>");
AddFunction("PulsingF<Int<800>>");
AddFunction("RandomBlinkF<Int<3000>>");
AddFunction("RandomF");
AddFunction("RandomPerLEDF");
AddFunction("SequenceF<100, 37, 0b0001010100011100, 0b0111000111000101, 0b0100000000000000>");
AddFunction("SparkleF");
AddFunction("StrobeF<Int<15>, Int<1>>");
AddFunction("BlastFadeoutF");
AddFunction("OriginalBlastF");
AddFunction("Variation");
AddFunction("AltF");
AddFunction("SyncAltToVarianceF");
AddFunction("TwistAngle<>");
AddFunction("TwistAcceleration<>");
AddFunction("BladeAngle<>");
AddFunction("Sum<RandomPerLEDF, Bump<Int<16384>>>");
AddFunction("Subtract<RandomPerLEDF, Bump<Int<16384>>>");
AddFunction("Mult<RandomPerLEDF, Bump<Int<16384>>>");
AddFunction("Percentage<RandomPerLEDF, 20>");
AddFunction("Divide<RandomPerLEDF, Int<10>>");
AddFunction("ModF<Sin<Int<10>>, Int<8192>>");
AddFunction("HoldPeakF<RandomF, Int<300>, Int<32768>>");
AddFunction("CenterDistF<>");
AddFunction("EffectPosition<>");
AddFunction("TimeSinceEffect<>");
AddFunction("WavNum<>");
AddFunction("WavLen<>");
AddFunction("CircularSectionF<Sin<Int<3>>, Sin<Int<2>>>");
AddFunction("LinearSectionF<Sin<Int<3>>, Sin<Int<2>>>");
AddFunction("EffectRandomF<EFFECT_CLASH>");
AddFunction("EffectPulseF<EFFECT_CLASH>");
AddFunction("IncrementWithReset<EffectPulseF<EFFECT_CLASH>>");
AddFunction("IncrementModuloF<EffectPulseF<EFFECT_CLASH>>");
AddFunction("ThresholdPulseF<Saw<Int<60>>, Int<16384>>");
AddFunction("IncrementF<Saw<Int<60>>, Int<16384>, Int<32768>, Int<1024>>");
AddFunction("EffectIncrementF<EFFECT_CLASH, Int<32768>, Int<8192>>");
AddFunction("MarbleF<Int<-2000>, Int<40000>, Ifon<Int<827680>, Int<0>>, Int<1276800>>");
AddFunction("LockupPulseF<SaberBase::LOCKUP_NORMAL>");

AddColor("AliceBlue", 223, 239, 255);
AddColor("Aqua", 0, 255, 255);
AddColor("Aquamarine", 55, 255, 169);
AddColor("Azure", 223, 255, 255);
AddColor("Bisque", 255, 199, 142);
AddColor("Black", 0, 0, 0);
AddColor("BlanchedAlmond", 255, 213, 157);
AddColor("Blue", 0, 0, 255);
AddColor("Chartreuse", 55, 255, 0);
AddColor("Coral", 255, 55, 19);
AddColor("Cornsilk", 255, 239, 184);
AddColor("Cyan", 0, 255, 255);
AddColor("DarkOrange", 255, 68, 0);
AddColor("DeepPink", 255, 0, 75);
AddColor("DeepSkyBlue", 0, 135, 255);
AddColor("DodgerBlue", 2, 72, 255);
AddColor("FloralWhite", 255, 244, 223);
AddColor("GhostWhite", 239, 239, 255);
AddColor("Green", 0, 255, 0);
AddColor("GreenYellow", 108, 255, 6);
AddColor("HoneyDew", 223, 255, 223);
AddColor("HotPink", 255, 36, 118);
AddColor("Ivory", 255, 255, 223);
AddColor("LavenderBlush", 255, 223, 233);
AddColor("LemonChiffon", 255, 244, 157);
AddColor("LightCyan", 191, 255, 255);
AddColor("LightPink", 255, 121, 138);
AddColor("LightSalmon", 255, 91, 50);
AddColor("LightYellow", 255, 255, 191);
AddColor("Magenta", 255, 0, 255);
AddColor("MintCream", 233, 255, 244);
AddColor("MistyRose", 255, 199, 193);
AddColor("Moccasin", 255, 199, 119);
AddColor("NavajoWhite", 255, 187, 108);
AddColor("Orange", 255, 97, 0);
AddColor("OrangeRed", 255, 14, 0);
AddColor("PapayaWhip", 255, 221, 171);
AddColor("PeachPuff", 255, 180, 125);
AddColor("Pink", 255, 136, 154);
AddColor("Red", 255, 0, 0);
AddColor("SeaShell", 255, 233, 219);
AddColor("Snow", 255, 244, 244);
AddColor("SpringGreen", 0, 255, 55);
AddColor("SteelBlue", 14, 57, 118);
AddColor("Tomato", 255, 31, 15);
AddColor("White", 255, 255, 255);
AddColor("Yellow", 255, 255, 0);

AddLayer("InOutHelperL<InOutFuncX<Int<300>,Int<800>>>");
AddLayer("InOutTrL<TrWipe<300>,TrWipeIn<500>>");

AddLayer("ResponsiveLockupL<White, TrInstant, TrInstant, Int<26000>, Int<6000>>");
AddLayer("ResponsiveLightningBlockL<White, TrInstant, TrInstant>");
AddLayer("ResponsiveMeltL<Mix<TwistAngle<>,Red,Yellow>, TrInstant, TrInstant, Int<4000>, Int<10000>>");
AddLayer("ResponsiveDragL<White, TrInstant, TrInstant, Int<2000>, Int<10000>>");
AddLayer("ResponsiveClashL<White, TrInstant, TrFade<200>, Int<26000>, Int<6000>>");
AddLayer("ResponsiveBlastL<White, Int<400>, Int<100>, Int<400>, Int<28000>, Int<8000>>");
AddLayer("ResponsiveBlastWaveL<White, Int<400>, Int<100>, Int<400>, Int<28000>, Int<8000>>");
AddLayer("ResponsiveBlastFadeL<White, Int<8000>, Int<400>, Int<28000>, Int<8000>>");
AddLayer("ResponsiveStabL<White, TrWipeIn<600>, TrWipe<600>, Int<14000>, Int<8000>>");
AddLayer("SyncAltToVarianceL");

const WHITE = Rgb(255, 255, 255);
const RED = Rgb(255, 0, 0);
const GREEN = Rgb(0, 255, 0);
const BLUE = Rgb(0, 0, 255);
const YELLOW = Rgb(255, 255, 0);
const CYAN = Rgb(0, 255, 255);
const MAGENTA = Rgb(255, 0, 255);
const BLACK = Rgb(0, 0, 0);
const OrangeRed = Rgb(255, 14, 0);


const max = Math.max;

const sin = Math.sin;


let STATE_ON = 0;
// 1 = lockup
// 2 = drag
// 3 = lb
// 4 = melt
let STATE_LOCKUP = 0;
let STATE_ROTATE = 0;
let STATE_NUM_LEDS = 144;

let handled_lockups = {};

let current_style = InOutHelper(SimpleClash(Lockup(new BlastClass(BLUE, WHITE), new AudioFlickerClass(BLUE, WHITE)), WHITE, 40), 300, 800);

function IsHandledLockup(lockup_type) {
    return current_style.__handled_lockups[lockup_type];
}

function HandleLockup(lockup_type) {
    if (lockup_type.getInteger) {
        lockup_type = lockup_type.getInteger(0);
    }
    handled_lockups[lockup_type] = 1;
}


// TODO
// Gray out buttons not applicable to the current type.
// Save -> save to local storage (keep 10?) maybe with images?
// save as -> save to local storage with name
// Mix

//var current_style = InOutHelper(SimpleClash(Lockup(new BlastClass(new RainbowClass(), WHITE), new AudioFlickerClass(BLUE, WHITE)), WHITE, 40), 300, 800);
const blade = new Blade();

function AddBlast() {
    blade.addEffect(EFFECT_BLAST, Math.random() * 0.7 + 0.2);
}

function AddForce() {
    blade.addEffect(EFFECT_FORCE, Math.random() * 0.7 + 0.2);
}

let current_clash_value = 0;
let current_clash_strength = 0;

function AddClash() {
    current_clash_value = 200 + random(1600);
    current_clash_strength = 100 + random(current_clash_value);
    blade.addEffect(EFFECT_CLASH, Math.random() * 0.7 + 0.2);
}

function AddStab() {
    blade.addEffect(EFFECT_STAB, 1.0);
}

function AddNewfont() {
    blade.addEffect(EFFECT_NEWFONT, Math.random() * 0.7 + 0.2);
}

function AddBoot() {
    blade.addEffect(EFFECT_BOOT, Math.random() * 0.7 + 0.2);
}

function AddPreon() {
    blade.addEffect(EFFECT_PREON, 0.0);
}

const blast_hump = [255, 255, 252, 247, 240, 232, 222, 211,
    199, 186, 173, 159, 145, 132, 119, 106,
    94, 82, 72, 62, 53, 45, 38, 32,
    26, 22, 18, 14, 11, 9, 7, 5, 0];


const start_millis = new Date().getTime();

function actual_millis() {
    return new Date().getTime() - start_millis;
}

let current_micros = 0;
let current_micros_internal = 0;

function micros() {
    return current_micros;
}

function millis() {
    return current_micros / 1000;
}

function fract(v) {
    return v - Math.floor(v);
}

function FIND(id) {
    let ret = document.getElementById(id);
    if (!ret) {
        // console.log("Failed to find " + id);
    }
    return ret;
}


function random(i) {
    return Math.floor(Math.random() * i);
}

function clamp(a, b, c) {
    if (a < b) return b;
    if (a > c) return c;
    return a;
}



var last_detected_blade_effect;

var handled_types = {};

function PushHandledTypes() {
    ret = [handled_types, handled_lockups];
    handled_types = {};
    handled_lockups = {};
    return ret;
}

function PopHandledTypes(old) {
    handled_types = old[0];
    handled_lockups = old[1];
}

function HandleEffectType(t) {
    if (t.getInteger) t = t.getInteger(0);
    handled_types[t] = 1;
}

function IsHandledEffectType(t) {
    return current_style.__handled_types[EFFECT_STAB];
}


let focus_catcher;
let focus_trace = [undefined];

function Focus(T) {
    console.log("FOCUS=" + T);
    console.log(T);
    focus_catcher = T;
    focus_trace = [T];
    return T;
}

function StylePtr(T) {
    return T;
}


// TRANSITIONS

function AddBend(O, t, len, scale) {
    if (O.bend) {
        return O.bend(t, len, scale);
    } else {
        return scale * t / len;
    }
}



// Same as TRANSITION_BASE, but with INT argument instead
// of FUNCTION
class TRANSITION_BASE2 extends TRANSITION {
    constructor(comment, args) {
        super(comment, args);
        this.add_arg("MILLIS", "INT", "WipeIn time in milliseconds");
        this.restart_ = false;
        this.start_millis = 0;
        this.len_ = 0;
    }

    begin() {
        this.restart_ = true;
    }

    done() {
        return this.len_ == 0;
    }

    run(blade) {
        this.MILLIS.run(blade);
        if (this.restart_) {
            this.start_millis_ = millis();
            this.len_ = this.MILLIS.getInteger(0);
            this.restart_ = false;
        }
    }

    update(scale) {
        if (this.len_ == 0) return scale;
        var ms = millis() - this.start_millis_;
        if (ms > this.len_) {
            this.len_ = 0;
            return scale;
        }
        return ms * scale / this.len_;
    }
};







// FUNCTIONS

let BATTERY_LEVEL = 24000



function InOutFunc(O, I) {
    return InOutFuncX(Int(O), Int(I));
}

// TODO: InOutFuncTD


const TRIGGER_DELAY = 0;
const TRIGGER_ATTACK = 1;
const TRIGGER_SUSTAIN = 2;
const TRIGGER_RELEASE = 3;
const TRIGGER_OFF = 4;



function MOD(x, m) {
    if (x >= 0) return x % m;
    return m + ~((~x) % m)
}


const start = new Date().getTime();

let current_focus;
let current_focus_url;
let style_tree;

function newCall(Cls) {
    return new (Function.prototype.bind.apply(Cls, arguments));
}


const classes = {
    AlphaL: AlphaL,
    AlphaMixL: AlphaMixL,
    AudioFlicker: AudioFlicker,
    AudioFlickerL: AudioFlickerL,
    Blast: Blast,
    BlastL: BlastL,
    BlastF: BlastF,
    BlastFadeout: BlastFadeout,
    BlastFadeoutL: BlastFadeoutL,
    BlastFadeoutF: BlastFadeoutF,
    Blinking: Blinking,
    BlinkingL: BlinkingL,
    BlinkingX: BlinkingX,
    BlinkingF: BlinkingF,
    BrownNoiseFlicker: BrownNoiseFlicker,
    BrownNoiseFlickerL: BrownNoiseFlickerL,
    BrownNoiseF: BrownNoiseF,
    ColorCycle: ColorCycle,
    ColorChange: ColorChange,
    ColorSelect: ColorSelect,
    IntSelect: IntSelect,
    ColorSequence: ColorSequence,
    EffectSequence: EffectSequence,
    Cylon: Cylon,
    EasyBlade: EasyBlade,
    FOCUS: Focus,
    FireConfig: FireConfig,
    Gradient: Gradient,
    HumpFlicker: HumpFlicker,
    HumpFlickerL: HumpFlickerL,
    HumpFlickerF: HumpFlickerF,
    HumpFlickerFX: HumpFlickerFX,
    IgnitionDelay: IgnitionDelay,
    IgnitionDelayX: IgnitionDelayX,
    RetractionDelay: RetractionDelay,
    RetractionDelayX: RetractionDelayX,
    InOutHelper: InOutHelper,
    InOutHelperX: InOutHelperX,
    InOutHelperL: InOutHelperL,
    InOutHelperF: InOutHelperF,
    InOutSparkTip: InOutSparkTip,
    Layers: Layers,
    LocalizedClash: LocalizedClash,
    LocalizedClashL: LocalizedClashL,
    Lockup: Lockup,
    LockupL: LockupL,
    LockupTr: LockupTr,
    LockupTrL: LockupTrL,
    Mix: Mix,
    OnSpark: OnSpark,
    OnSparkX: OnSparkX,
    OnSparkL: OnSparkL,
    OnSparkF: OnSparkF,
    OriginalBlast: OriginalBlast,
    OriginalBlastL: OriginalBlastL,
    OriginalBlastF: OriginalBlastF,
    Pulsing: Pulsing,
    PulsingX: PulsingX,
    PulsingL: PulsingL,
    PulsingF: PulsingF,
    RandomFlicker: RandomFlicker,
    RandomL: RandomL,
    RandomF: RandomF,
    RandomPerLEDFlicker: RandomPerLEDFlicker,
    RandomPerLEDFlickerL: RandomPerLEDFlickerL,
    RandomPerLEDF: RandomPerLEDF,
    RandomBlink: RandomBlink,
    RandomBlinkX: RandomBlinkX,
    RandomBlinkL: RandomBlinkL,
    RandomBlinkF: RandomBlinkF,
    Remap: Remap,
    Sequence: Sequence,
    SequenceL: SequenceL,
    SequenceF: SequenceF,
    Rgb: Rgb,
    Rgb16: Rgb16,
    SimpleClash: SimpleClash,
    SimpleClashL: SimpleClashL,
    Sparkle: Sparkle,
    SparkleL: SparkleL,
    SparkleF: SparkleF,
    Strobe: Strobe,
    StrobeX: StrobeX,
    StrobeL: StrobeL,
    StrobeF: StrobeF,
    Stripes: Stripes,
    StripesX: StripesX,
    StyleFire: StyleFire,
    StylePtr: StylePtr,
    StyleFirePtr: StyleFirePtr,
    StyleNormalPtr: StyleNormalPtr,
    StyleRainbowPtr: StyleRainbowPtr,
    StyleStrobePtr: StyleStrobePtr,
    StaticFire: StaticFire,
    TransitionLoop: TransitionLoop,
    TransitionLoopL: TransitionLoopL,
    TransitionEffect: TransitionEffect,
    TransitionEffectL: TransitionEffectL,
    MultiTransitionEffect: MultiTransitionEffect,
    MultiTransitionEffectL: MultiTransitionEffectL,
    TransitionPulseL: TransitionPulseL,
    InOutTr: InOutTr,
    InOutTrL: InOutTrL,

    RotateColorsX: RotateColorsX,
    RotateColors: RotateColors,
    HueX: HueX,
    Hue: Hue,

    TrInstant: TrInstant,
    TrFade: TrFade,
    TrFadeX: TrFadeX,
    TrSmoothFade: TrSmoothFade,
    TrSmoothFadeX: TrSmoothFadeX,
    TrDelay: TrDelay,
    TrDelayX: TrDelayX,
    TrBoing: TrBoing,
    TrBoingX: TrBoingX,
    TrBlink: TrBlink,
    TrBlinkX: TrBlinkX,
    TrDoEffect: TrDoEffect,
    TrDoEffectX: TrDoEffectX,
    TrDoEffectAlways: TrDoEffectAlways,
    TrDoEffectAlwaysX: TrDoEffectAlwaysX,
    TrWipe: TrWipe,
    TrWipeX: TrWipeX,
    TrWipeIn: TrWipeIn,
    TrWipeInX: TrWipeInX,
    TrCenterWipe: TrCenterWipe,
    TrCenterWipeX: TrCenterWipeX,
    TrCenterWipeSpark: TrCenterWipeSpark,
    TrCenterWipeSparkX: TrCenterWipeSparkX,
    TrCenterWipeIn: TrCenterWipeIn,
    TrCenterWipeInX: TrCenterWipeInX,
    TrCenterWipeInSpark: TrCenterWipeInSpark,
    TrCenterWipeInSparkX: TrCenterWipeInSparkX,
    TrColorCycle: TrColorCycle,
    TrColorCycleX: TrColorCycleX,
    TrConcat: TrConcat,
    TrJoin: TrJoin,
    TrJoinR: TrJoinR,
    TrRandom: TrRandom,
    TrSelect: TrSelect,
    TrWaveX: TrWaveX,
    TrSparkX: TrSparkX,
    TrWipeSparkTip: TrWipeSparkTip,
    TrWipeSparkTipX: TrWipeSparkTipX,
    TrWipeInSparkTip: TrWipeInSparkTip,
    TrWipeInSparkTipX: TrWipeInSparkTipX,
    TrExtendX: TrExtendX,
    TrExtend: TrExtend,
    TrLoop: TrLoop,
    TrLoopN: TrLoopN,
    TrLoopNX: TrLoopNX,
    TrLoopUntil: TrLoopUntil,

    ReverseTime: ReverseTime,
    ReverseTimeX: ReverseTimeX,
    BendTimePow: BendTimePow,
    BendTimePowX: BendTimePowX,
    BendTimePowInv: BendTimePowInv,
    BendTimePowInvX: BendTimePowInvX,

    BatteryLevel: BatteryLevel,
    VolumeLevel: VolumeLevel,
    Bump: Bump,
    Ifon: Ifon,
    ChangeSlowly: ChangeSlowly,
    InOutFunc: InOutFunc,
    InOutFuncX: InOutFuncX,
    Int: Int,
    IntArg: IntArg_,
    RgbArg: RgbArg_,
    Scale: Scale,
    InvertF: InvertF,
    Sin: Sin,
    Saw: Saw,
    Trigger: Trigger,
    SmoothStep: SmoothStep,
    RampF: RampF,
    Mult: Mult,
    Percentage: Percentage,
    NoisySoundLevel: NoisySoundLevel,
    NoisySoundLevelCompat: NoisySoundLevelCompat,
    SmoothSoundLevel: SmoothSoundLevel,
    SwingSpeedX: SwingSpeedX,
    SwingSpeed: SwingSpeed,
    SwingAccelerationX: SwingAccelerationX,
    SwingAcceleration: SwingAcceleration,
    ClashImpactFX: ClashImpactFX,
    ClashImpactF: ClashImpactF,
    LayerFunctions: LayerFunctions,
    SlowNoise: SlowNoise,
    IsLessThan: IsLessThan,
    IsGreaterThan: IsGreaterThan,
    IsBetween: IsBetween,
    ClampFX: ClampFX,
    ClampF: ClampF,
    Variation: Variation,
    AltF: AltF,
    SyncAltToVarianceF: SyncAltToVarianceF,
    SyncAltToVarianceL: SyncAltToVarianceL,
    BladeAngleX: BladeAngleX,
    BladeAngle: BladeAngle,
    TwistAngle: TwistAngle,
    TwistAcceleration: TwistAcceleration,
    Sum: Sum,
    Divide: Divide,
    ModF: ModF,
    Subtract: Subtract,
    HoldPeakF: HoldPeakF,
    ThresholdPulseF: ThresholdPulseF,
    EffectRandomF: EffectRandomF,
    EffectPulseF: EffectPulseF,
    EffectPosition: EffectPosition,
    TimeSinceEffect: TimeSinceEffect,
    WavNum: WavNum,
    CenterDistF: CenterDistF,
    CircularSectionF: CircularSectionF,
    LinearSectionF: LinearSectionF,
    IncrementWithReset: IncrementWithReset,
    IncrementModuloF: IncrementModuloF,
    IncrementF: IncrementF,
    EffectIncrementF: EffectIncrementF,
    MarbleF: MarbleF,

    ResponsiveLockupL: ResponsiveLockupL,
    ResponsiveDragL: ResponsiveDragL,
    ResponsiveMeltL: ResponsiveMeltL,
    ResponsiveLightningBlockL: ResponsiveLightningBlockL,
    ResponsiveClashL: ResponsiveClashL,
    ResponsiveBlastL: ResponsiveBlastL,
    ResponsiveBlastWaveL: ResponsiveBlastWaveL,
    ResponsiveBlastFadeL: ResponsiveBlastFadeL,
    ResponsiveStabL: ResponsiveStabL,

    IgnitionTime: IgnitionTime,
    RetractionTime: RetractionTime,
    WavLen: WavLen,
    LockupPulseF: LockupPulseF,
};


AddIdentifier("RgbCycle", RgbCycle);
AddIdentifier("Rainbow", Rainbow);
AddIdentifier("WHITE", Rgb.bind(null, 255, 255, 255));
AddIdentifier("BLACK", Rgb.bind(null, 0, 0, 0));

AddIdentifier("RED", Rgb.bind(null, 255, 0, 0));
AddIdentifier("GREEN", Rgb.bind(null, 0, 255, 0));
AddIdentifier("BLUE", Rgb.bind(null, 0, 0, 255));
AddIdentifier("YELLOW", Rgb.bind(null, 255, 255, 0));
AddIdentifier("CYAN", Rgb.bind(null, 0, 255, 255));
AddIdentifier("MAGENTA", Rgb.bind(null, 255, 0, 255));
AddIdentifier("WHITE", Rgb.bind(null, 255, 255, 255));
AddIdentifier("BLACK", Rgb.bind(null, 0, 0, 0));

AddIdentifier("AliceBlue", Rgb.bind(null, 223, 239, 255));
AddIdentifier("Aqua", Rgb.bind(null, 0, 255, 255));
AddIdentifier("Aquamarine", Rgb.bind(null, 55, 255, 169));
AddIdentifier("Azure", Rgb.bind(null, 223, 255, 255));
AddIdentifier("Bisque", Rgb.bind(null, 255, 199, 142));
AddIdentifier("Black", Rgb.bind(null, 0, 0, 0));
AddIdentifier("BlanchedAlmond", Rgb.bind(null, 255, 213, 157));
AddIdentifier("Blue", Rgb.bind(null, 0, 0, 255));
AddIdentifier("Chartreuse", Rgb.bind(null, 55, 255, 0));
AddIdentifier("Coral", Rgb.bind(null, 255, 55, 19));
AddIdentifier("Cornsilk", Rgb.bind(null, 255, 239, 184));
AddIdentifier("Cyan", Rgb.bind(null, 0, 255, 255));
AddIdentifier("DarkOrange", Rgb.bind(null, 255, 68, 0));
AddIdentifier("DeepPink", Rgb.bind(null, 255, 0, 75));
AddIdentifier("DeepSkyBlue", Rgb.bind(null, 0, 135, 255));
AddIdentifier("DodgerBlue", Rgb.bind(null, 2, 72, 255));
AddIdentifier("FloralWhite", Rgb.bind(null, 255, 244, 223));
AddIdentifier("Fuchsia", Rgb.bind(null, 255, 0, 255));
AddIdentifier("GhostWhite", Rgb.bind(null, 239, 239, 255));
AddIdentifier("Green", Rgb.bind(null, 0, 255, 0));
AddIdentifier("GreenYellow", Rgb.bind(null, 108, 255, 6));
AddIdentifier("HoneyDew", Rgb.bind(null, 223, 255, 223));
AddIdentifier("HotPink", Rgb.bind(null, 255, 36, 118));
AddIdentifier("Ivory", Rgb.bind(null, 255, 255, 223));
AddIdentifier("LavenderBlush", Rgb.bind(null, 255, 223, 233));
AddIdentifier("LemonChiffon", Rgb.bind(null, 255, 244, 157));
AddIdentifier("LightCyan", Rgb.bind(null, 191, 255, 255));
AddIdentifier("LightPink", Rgb.bind(null, 255, 121, 138));
AddIdentifier("LightSalmon", Rgb.bind(null, 255, 91, 50));
AddIdentifier("LightYellow", Rgb.bind(null, 255, 255, 191));
AddIdentifier("Lime", Rgb.bind(null, 0, 255, 0));
AddIdentifier("Magenta", Rgb.bind(null, 255, 0, 255));
AddIdentifier("MintCream", Rgb.bind(null, 233, 255, 244));
AddIdentifier("MistyRose", Rgb.bind(null, 255, 199, 193));
AddIdentifier("Moccasin", Rgb.bind(null, 255, 199, 119));
AddIdentifier("NavajoWhite", Rgb.bind(null, 255, 187, 108));
AddIdentifier("Orange", Rgb.bind(null, 255, 97, 0));
AddIdentifier("OrangeRed", Rgb.bind(null, 255, 14, 0));
AddIdentifier("PapayaWhip", Rgb.bind(null, 255, 221, 171));
AddIdentifier("PeachPuff", Rgb.bind(null, 255, 180, 125));
AddIdentifier("Pink", Rgb.bind(null, 255, 136, 154));
AddIdentifier("Red", Rgb.bind(null, 255, 0, 0));
AddIdentifier("SeaShell", Rgb.bind(null, 255, 233, 219));
AddIdentifier("Snow", Rgb.bind(null, 255, 244, 244));
AddIdentifier("SpringGreen", Rgb.bind(null, 0, 255, 55));
AddIdentifier("SteelBlue", Rgb.bind(null, 14, 57, 118));
AddIdentifier("Tomato", Rgb.bind(null, 255, 31, 15));
AddIdentifier("White", Rgb.bind(null, 255, 255, 255));
AddIdentifier("Yellow", Rgb.bind(null, 255, 255, 0));


let rotate_start;
let last_micros;

let last_actual_millis = actual_millis() - 10;
let time_factor = 1000; // transforms ms to us

let last_style;
let show_style;

let numTick = 0;
let framesPerUpdate = 0;
var timeFactor = 1.0;
let bad_fps = 0;

