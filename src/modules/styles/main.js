let popupIdentifier;
const popupWindow = FIND("popup_window");
const overlay = FIND("overlay");

function showPopupMessage(message, currentPopup) {
    popupIdentifier = currentPopup;
    const checkbox = FIND("dont_show_again");
    checkbox.checked = localStorage.getItem(popupIdentifier) === "false";

    if (localStorage.getItem(popupIdentifier) === "false") {
        console.log(popupIdentifier + " is disabled.");
    } else {
        FIND("popup_message").innerHTML = message;
        popupWindow.classList.add("show");
        overlay.classList.add("show");
    }
}

function dismissPopupMessage() {
    popupWindow.classList.remove("show");
    overlay.classList.remove("show");
}

function DontShowAgain(checkboxState) {
    checkboxState = !checkboxState;
    localStorage.setItem(popupIdentifier, checkboxState);
    console.log("Saving " + popupIdentifier + " " + checkboxState);
}

let pixels;

function drawScene() {
    const now_actual_millis = actual_millis();
    const delta_actual_millis = now_actual_millis - last_actual_millis;
    last_actual_millis = now_actual_millis;

    const delta_us = delta_actual_millis * time_factor;
    last_micros = current_micros;
    current_micros_internal += delta_us;
    current_micros = current_micros_internal
    if (current_micros - last_micros > 1000000 / 45) {
        bad_fps++;
    } else {
        if (bad_fps) bad_fps--;
    }
    if (bad_fps > 10 && graflexState.get()) {
        showPopupMessage("Struggling to render hilt model.<br>Switching to simpler design.<br>To re-enable Graflex model, go to Settings.", "graflexPopup");
        graflexState.set(false);
    }
    num_leds = blade.num_leds()
    if (!pixels || pixels.length < num_leds * 4 * 2) {
        pixels = new Uint8Array(num_leds * 4 * 2);
    }
    let S = current_style;
    if (S !== last_style) {
        last_style = S;

        if (S.getType) {
            S.set_right_side(current_focus || style_tree)
            if (S.getType() === "TRANSITION") {
                S = TransitionLoop(Rgb(0, 0, 0), TrConcat(TrDelay(500), Rgb(255, 0, 0), S, Rgb(0, 0, 255), TrInstant()));
            }
            if (S.getType() === "FUNCTION") {
                S = Mix(S, Rgb(0, 0, 0), Rgb(255, 255, 255));
            }
        }

        show_style = S;

    } else {
        S = show_style;
    }

    numTick++;

    if (S.getColor && S.getType && S.getType() === "COLOR" && numTick > framesPerUpdate) {
        let i, c;
        numTick = 0;
        S.run(blade);

        for (i = 0; i < num_leds; i++) {
            c = S.getColor(i);
            pixels[i * 4 + 0] = Math.round(c.r * 255);
            pixels[i * 4 + 1] = Math.round(c.g * 255);
            pixels[i * 4 + 2] = Math.round(c.b * 255);
            pixels[i * 4 + 3] = 255;
        }

        if (last_micros !== 0) {
            current_micros += delta_us / 2;
        }

        if (framesPerUpdate === 0) {
            S.run(blade);
        }

        for (i = 0; i < num_leds; i++) {
            c = S.getColor(i);
            pixels[i * 4 + 0 + num_leds * 4] = Math.round(c.r * 255);
            pixels[i * 4 + 1 + num_leds * 4] = Math.round(c.g * 255);
            pixels[i * 4 + 2 + num_leds * 4] = Math.round(c.b * 255);
            pixels[i * 4 + 3 + num_leds * 4] = 255;
        }

        S.update_displays();
    }
    // TODO: Generate mipmaps, then adjust level based on distance from blade
    gl.texImage2D(
        gl.TEXTURE_2D,
        0,        // level
        gl.RGBA,  // internalFormat
        num_leds, 2,   // width, height
        0,        // border
        gl.RGBA,   // source format
        gl.UNSIGNED_BYTE, // source type
        pixels);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Draw these textures to the screen, offset by 1 pixel increments
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, width * dpr, height * dpr);
    gl.clearColor(0.0, 1.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.viewport(0, 0, width * dpr, height * dpr);
    let rotation = MOVE_MATRIX;

    if (STATE_ROTATE) {
        const u_value = (new Date().getTime() - rotate_start) / 3000.0;
        rotation = default_move_matrix();
        rotation = rotation.mult(Matrix.mkyrot(u_value));
        rotation = rotation.mult(Matrix.mkzrot(u_value / 7.777));

    } else {
        if (0) {
            OLD_MOVE_MATRIX = default_move_matrix();
            rotation = default_move_matrix();
            rotation = rotation.mult(Matrix.mkzrot(0.2));
        }
        rotate_start = new Date().getTime();
    }

    gl.uniform1f(gl.getUniformLocation(shaderProgram, "u_time"), (new Date().getTime() - start) / 1000.0);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "u_width"), width);
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "u_height"), height);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "u_move_matrix"), false, rotation.values);
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "u_old_move_matrix"), false, OLD_MOVE_MATRIX.values);
    OLD_MOVE_MATRIX = rotation;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    t += 1;
}

function tick() {
    window.requestAnimationFrame(tick);
    drawScene();
}

let overall_string;

function ReplaceCurrentFocus(str) {
    current_focus_url = str;

    if (current_focus) {
        current_focus.super_short_desc = true;
        pp_is_url++;
        pp_is_verbose++;
        var url = style_tree.pp();
        console.log("FOCUS URL: " + url);
        pp_is_url--;
        pp_is_verbose--;
        current_focus.super_short_desc = false;
        str = url.replace("$", "FOCUS<" + str + ">");
    }

    const old_focus = current_focus;

    current_focus = 0;
    focus_catcher = 0;

    const parser = new Parser(str, classes, identifiers);

    try {
        style_tree = parser.parse();
    } catch (e) {
        var err = FIND("error_message");
        current_focus = old_focus;
        console.log(e);
        console.log(e.stack);
        console.log(typeof (e));
        if (typeof (e) == "string") {
            err.innerHTML = e;
            return;
        } else if (typeof (e) == "object" && e.constructor == MyError) {
            err.innerHTML = e.desc;
            return;
        } else {
            throw e;
        }
    }
    let tmp = "";
    tmp += style_tree.pp();
    FIND("pp").innerHTML = tmp;
    if (focus_catcher) {
        current_focus = focus_catcher;
        const id = current_focus.get_id();
        const container = FIND("X" + id);
        if (!container) {
            console.log("Lost focus when parsing " + str);
            console.log(focus_trace);
        } else {
            container.classList.add("selected-area-container");
        }
    } else {
        console.log("No focus catcher found!!");
    }
    let type = "COLOR";
    let classname = "Style";
//  if (current_focus && current_style && current_focus != current_style) {
//    type = current_style.getType();
//    classname = current_focus.constructor.name;
//  }

    if (current_style) {
        type = current_style.getType();
        classname = current_style.constructor.name;
    }

    AddHistory(current_focus_url, current_style.getType());
    console.log("TYPE = " + type);
    // FIND("color_links").className = type == "COLOR" ? "normal" : "grayout";
    // FIND("effect_links").className = type == "COLOR" ? "normal" : "grayout";
    // FIND("effect_type_links").className = type == "EFFECT" ? "normal" : "grayout";
    // FIND("template_links").className = type == "COLOR" ? "normal" : "grayout";
    // FIND("function_links").className = type == "FUNCTION" ? "normal" : "grayout";
    // FIND("transition_links").className = type == "TRANSITION" ? "normal" : "grayout";
    FIND("expand_button").className = current_style && current_style.isMacro ? "button-on" : "button-off";
    FIND("layerize_button").className = CanLayerize(current_style) ? "button-on" : "button-off";

    if (type === "COLOR" && classname.endsWith("LClass")) {
        ActivateTab("layer");
    } else if (type === "COLOR" && (classname === "Rgb16Class" || classname === "RgbClass")) {
        ActivateTab("rgb");
    } else if (type === "ArgumentName") {
        ActivateTab("arguments");
    } else {
        ActivateTab(type.toLowerCase());
    }

    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];

        for (let r = 0; r < sheet.cssRules.length; r++) {
            const rule = sheet.cssRules[r];

            if (rule.cssText.toLowerCase().includes("magic_class_")) {
                if (rule.cssText.toLowerCase().includes("magic_class_" + type.toLowerCase())) {
                    rule.style.background = "lightblue";
                    rule.style.color = "black";
                } else {
                    rule.style.background = "lightgray";
                    rule.style.color = "darkgray";
                }
            }
            if (rule.cssText.toLowerCase().includes("magic_invisible_class_")) {
                if (rule.cssText.toLowerCase().includes("magic_invisible_class_" + type.toLowerCase())) {
                    rule.style.display = 'inline';
                } else {
                    rule.style.display = 'none';
                }
            }
        }
    }
}


function Run() {
    const sty = FIND("style");
    const err = FIND("error_message");
    const str = sty.value;
    let parser = new Parser(str,
        classes,
        identifiers);
    err.innerHTML = "";

    try {
        current_style = parser.parse();
    } catch (e) {
        console.log(e);
        console.log(e.stack);
        console.log(typeof (e));

        if (typeof (e) == "string") {

            err.innerHTML = e;
            sty.focus();
            sty.setSelectionRange(parser.pos, parser.pos);

            parser = new Parser("BLACK",
                classes,
                identifiers);
            current_style = parser.parse();
            compile();
            return;

        } else if (typeof (e) == "object" && e.constructor == MyError) {
            err.innerHTML = e.desc;
            sty.focus();
            if (e.begin_pos > -1) {
                sty.setSelectionRange(e.begin_pos, e.end_pos);
            } else {
                sty.setSelectionRange(parser.pos, parser.pos);
            }

            parser = new Parser("BLACK",
                classes,
                identifiers);
            current_style = parser.parse();
            compile();
            return;

        } else {
            throw e;
        }
    }
    ReplaceCurrentFocus(str);
    compile();

    if (current_style.argstring) {
        FIND("ARGSTR").value = "builtin 0 1 " + current_style.argstring
        ArgStringChanged();
    }
}

let ARGUMENTS = ["builtin", "0", "1"];
const default_arguments = [];

function updateArgTag(ARG, VALUE) {
    const N = ArgumentName_ENUM_BUILDER.value_to_name[ARG];
    const tag = FIND("ARGSTR_" + N);

    if (VALUE.search(",") >= 0) {
        console.log("FIXING COLOR VALUE: " + VALUE);
        const values = VALUE.split(",");
        VALUE = '#' + UnFixColor(values[0]) + UnFixColor(values[1]) + UnFixColor(values[2]);
    }
    console.log("Setting tag from: " + tag.value + " to " + VALUE);
    tag.value = VALUE;
}

function getARG(ARG, DEFAULT) {
    ARG = ARG + 2;
    if (!default_arguments[ARG]) {
        updateArgTag(ARG - 2, DEFAULT);
    }
    default_arguments[ARG] = DEFAULT;
    if (ARGUMENTS[ARG] && ARGUMENTS[ARG] !== "~")
        return ARGUMENTS[ARG];
    return DEFAULT;
}

function ArgStringChanged() {
    const tag = FIND("ARGSTR");
    ARGUMENTS = tag.value.split(" ");

    for (let i = 3; i < ARGUMENTS.length; i++) {
        if (ARGUMENTS[i] === "~") continue;
        if (!ARGUMENTS[i]) continue;
        const ARG = i - 2;
        updateArgTag(ARG, ARGUMENTS[i]);
    }
}

function setARG(ARG, TO) {
    ARG += 2;
    ARGUMENTS[ARG] = TO;
    for (let i = 0; i < ARGUMENTS.length; i++) {
        if (!ARGUMENTS[i]) {
            ARGUMENTS[i] = '~';
        }
    }
    FIND("ARGSTR").value = ARGUMENTS.join(" ");
}

function ArgChanged(ARG) {
    const N = ArgumentName_ENUM_BUILDER.value_to_name[ARG];
    const tag = FIND("ARGSTR_" + N);
    setARG(ARG, tag.value);
}

function IncreaseArg(ARG, I) {
    const N = ArgumentName_ENUM_BUILDER.value_to_name[ARG];
    const tag = FIND("ARGSTR_" + N);
    tag.value = parseInt(tag.value) + I;
    setARG(ARG, tag.value);
}

function ClickArgColor(ARG) {
    const N = ArgumentName_ENUM_BUILDER.value_to_name[ARG];
    const tag = FIND("ARGSTR_" + N);
    const R = FixColor(tag.value.substr(1, 2));
    const G = FixColor(tag.value.substr(3, 2));
    const B = FixColor(tag.value.substr(5, 2));
    setARG(ARG, R + "," + G + "," + B);
}

function PopState(event) {
    if (event.state) {
        FIND("style").value = event.state;
        Run();
    }
}

function SetTo(str) {
    console.log(str);
    const old = FIND("style").value;
    const url = new URL(window.location.href);
    url.searchParams.set("S", str);

    // FIXME: Use pushState and fix back arrow
    window.history.replaceState(old, "Style Editor", window.location.href);
    window.history.pushState(str, "Style Editor", url);
    window.onpopstate = PopState;

    FIND("style").value = str;
    Run();
}

function SetToAndFormat(str) {
    const parser = new Parser(str, classes, identifiers);
    const style = parser.parse();
    pp_is_url++;
    const url = style.pp();
    pp_is_url--;
    SetTo(url);
}

function FocusOnLow(id) {
    console.log("FOCUSON: " + id);
    const style = style_ids[id];

    console.log(id);
    console.log(style);
    current_focus = style;

    const container = FIND("X" + id);
    console.log(container);
    container.style.backgroundColor = 'lightblue';
    pp_is_url++;
    const url = style.pp();
    pp_is_url--;
    console.log(url);
    current_focus_url = url;
    SetTo(url);
    return true;
}

function FocusOn(id, event) {
    event.stopPropagation();
    FocusOnLow(id);
}

function ClickRotate() {
    STATE_ROTATE = !STATE_ROTATE;
    const rotate_button = FIND("ROTATE_BUTTON");
    rotate_button.classList.toggle("button-latched", STATE_ROTATE ? true : false);
    console.log("ROTATE");
}

function ClickPower() {
    STATE_ON = !STATE_ON;
    STATE_LOCKUP = 0;
    const power_button = FIND("POWER_BUTTON");
    power_button.classList.toggle("button-latched", STATE_ON ? true : false);
    console.log("POWER");
    blade.addEffect(STATE_ON ? EFFECT_IGNITION : EFFECT_RETRACTION, Math.random() * 0.7 + 0.2);
}

const lockups_to_event = {};
lockups_to_event[LOCKUP_NORMAL] = [EFFECT_LOCKUP_BEGIN, EFFECT_LOCKUP_END];
lockups_to_event[LOCKUP_DRAG] = [EFFECT_DRAG_BEGIN, EFFECT_DRAG_END];

function OnLockupChange() {
    console.log("OnLockupChange");
    const select = FIND("LOCKUP");
    const old = STATE_LOCKUP;

    STATE_LOCKUP = window[select.value];

    if (STATE_LOCKUP && lockups_to_event[STATE_LOCKUP]) {
        blade.addEffect(lockups_to_event[STATE_LOCKUP][0], Math.random() * 0.7 + 0.2);
    } else if (old && lockups_to_event[old]) {
        blade.addEffect(lockups_to_event[old][1], Math.random() * 0.7 + 0.2);
    }
}

function ClickLockup() {
    STATE_LOCKUP = STATE_LOCKUP === LOCKUP_NORMAL ? 0 : LOCKUP_NORMAL;
    blade.addEffect(STATE_LOCKUP ? EFFECT_LOCKUP_BEGIN : EFFECT_LOCKUP_END, Math.random() * 0.7 + 0.2);
}

function ClickDrag() {
    STATE_LOCKUP = STATE_LOCKUP === LOCKUP_DRAG ? 0 : LOCKUP_DRAG;
    blade.addEffect(STATE_LOCKUP ? EFFECT_DRAG_BEGIN : EFFECT_DRAG_END, 1.0);
}

function ClickLB() {
    STATE_LOCKUP = STATE_LOCKUP === LOCKUP_LIGHTNING_BLOCK ? 0 : LOCKUP_LIGHTNING_BLOCK;
}

function ClickMelt() {
    STATE_LOCKUP = STATE_LOCKUP === LOCKUP_MELT ? 0 : LOCKUP_MELT;
}

/* Save blade style to local storage via user OS dialog */
function ClickSave() {
    Copy();
    let textArea = FIND("style");
    let content = "/*\nSaved from ProffieOS Style Editor:\nhttps://fredrik.hubbe.net/lightsaber/style_editor.html\n*/" + "\n\n" + textArea.value;
    const a = document.createElement("a");
    const file = new Blob([content], {type: "text/plain"});

    a.href = URL.createObjectURL(file);
    a.download = "blade-style.txt";
    a.click();
}

const num_alternatives = 1000;

function Alt() {
    return parseInt(FIND("ALT").value);
}

function IncreaseAlt(n) {
    let v = Alt() + n;
    if (v < 0) v += num_alternatives;
    if (v > num_alternatives) v -= num_alternatives;
    FIND("ALT").value = v;
}

function Variant() {
    return parseInt(FIND("VARIANT_VALUE").value);
}

/* Variant Slider functions */

function updateVariantValue(newValue) {
    if (newValue < 0) {
        newValue = 0;
    } else if (newValue > 32768) {
        newValue = 32768;
    }
    FIND("VARIANT_VALUE").value = newValue;
    FIND("VARIANT_SLIDER").value = newValue;
    console.log("Updated Variant: " + newValue);
}

let timeoutId, intervalId;

// Single click arrow to adjust by 1, hold to accelerate.
function startAdjustingValue(adjustment, inputId) {
    adjustmentValue(adjustment, inputId);
    const speed = 100;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        const startTime = new Date().getTime();

        intervalId = setInterval(function () {
            const elapsedTime = new Date().getTime() - startTime;
            const progress = elapsedTime / speed;
            const ease = Math.pow(progress, 2);
            const value = Math.round(adjustment * ease);
            adjustmentValue(value, inputId);
        }, 1000 / 60); // 60 FPS for more responsive input.
    }, 500); // delay until hold down button acceleration starts.
}

function adjustmentValue(adjustment, inputId) {
    const variantInput = FIND(inputId);
    const newValue = parseInt(variantInput.value) + adjustment;
    variantInput.value = newValue;
    updateVariantValue(newValue);
}

// Release or mouse leave arrow button
function stopAdjustingValue() {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
}

/* End Variant Slider functions */

function Copy() {
    if (current_style.getType() !== "COLOR") {
        FIND("error_message").innerHTML = "Not a complete style.";
        return;
    }
    const color = current_style.getColor(0);

    if (color.a != 1.0) {
        FIND("error_message").innerHTML = "Style is transparent.";
        return;
    }

    const copyText = FIND("style");
    let argStr = '"' + ARGUMENTS.slice(3).join(" ") + '"';

    if (argStr === '""') argStr = "";
    if (copyText.value.includes("StylePtr") ||
        copyText.value.includes("StyleNormalPtr") ||
        copyText.value.includes("StyleFirePtr") ||
        copyText.value.includes("StyleRainbowPtr")) {
        if (!copyText.value.endsWith(")"))
            copyText.value = copyText.value + "(" + argStr + ")";
    } else {
        copyText.value = "StylePtr<" + copyText.value + ">" + "(" + argStr + ")";
    }
    copyText.select();
    document.execCommand("copy");
    // alert("Copy to Clipboard" + copyText.value);
    // myAlertTop("Copy to Clipboard");
}

function DoExpand() {
    if (current_style && current_style.expansion) {
        pp_is_url++;
        const url = current_style.expansion.pp();
        pp_is_url--;
        SetTo(url);
    }
}

function ShouldJoin(layer1, layer2) {
    if (layer1.LAYERS.length === 0) return true;
    if (layer2.LAYERS.length === 0) return true;
    return layer1.LAYERS[0].isEffect() === layer2.LAYERS[0].isEffect();
}

function RecursiveLayerize(node) {
    while (node.isMacro) {
        node = node.expansion;
    }
    if (node.constructor === LayersClass) {
        node.BASE = RecursiveLayerize(node.BASE);
        while (node.BASE.constructor === LayersClass && ShouldJoin(node, node.BASE)) {
            node = new LayersClass([node.BASE.BASE].concat(node.BASE.LAYERS, node.LAYERS));
        }
    }
    return node;
}

function CanLayerize(node) {
    if (!node) return false;
    if (node.constructor === LayersClass) return false;
    while (node.isMacro) {
        node = node.expansion;
    }
    return node.constructor === LayersClass;
}

function DoLayerize() {
    let tmp = RecursiveLayerize(current_style);
    pp_is_url++;
    tmp = tmp.pp();
    pp_is_url--;
    SetTo(tmp);
}

function DoArgify() {
    state = {}
    // Only do this if at top level...
    state.color_argument = BASE_COLOR_ARG;
    var tmp = current_style.argify(state);
    pp_is_url++;
    tmp = tmp.pp();
    pp_is_url--;
    SetTo(tmp);
}

function AddTab(tab, name, contents) {
    FIND("TABLINKS").innerHTML += "<button id=" + tab + "_tab class=tablinks onclick=\"ActivateTab('" + tab + "')\">" + name + "</button>";
    FIND("TABBODIES").innerHTML += "<div id=" + tab + "_tabcontent class='tabcontent " + tab + "-tabcontent'></div>";
    if (contents) {
        AddTabContent(tab, contents);
    }
}

function AddTabContent(tab, data) {
    FIND(tab + "_tabcontent").innerHTML += data;
}

function ActivateTab(tab) {
    if (!FIND(tab + "_tab")) {
        console.log("No such tab");
        return;
    }
    // Get all elements with class="tabcontent" and hide them
    var tabcontent = document.getElementsByClassName("tabcontent");
    for (var i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    var tablinks = document.getElementsByClassName("tablinks");
    for (var i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    FIND(tab + "_tabcontent").style.display = "block";
    FIND(tab + "_tab").className += " active";
}
