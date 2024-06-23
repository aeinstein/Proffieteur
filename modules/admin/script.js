bc = new BroadcastChannel('proffiediag');

bc.onmessage = (ev)=> {
    console.log(ev);

    if(ev.data.prop) {
        console.log("Props: " + ev.data.prop);
        document.getElementById("txtProp").value = ev.data.prop;
    }

    if(ev.data.buttons) {
        console.log("Buttons: " + ev.data.buttons);
        document.getElementById("txtButtons").value = ev.data.buttons;
    }

    if(ev.data.installdate){
        document.getElementById("txtInstalled").value = ev.data.installdate;
    }

    if(ev.data.tracks){
        let track_string = "";

        for (let l = 0; l < ev.data.tracks.length; l++) {
            const track = ev.data.tracks[l];
            // console.log(escape(track));
            if (track.length > 4) {
                const tmp = track.split('/');
                const title = tmp[tmp.length - 1].split('.')[0].toLowerCase();
                // console.log(title);
                // TODO: quote track properly
                track_string += "<div class=track onclick='PlayTrack(\"" + escape(track) + "\")'>";
                track_string += "<span class=title>" + title + "</span>";
                track_string += "</div>";
            }
        }

        FIND('tracks').innerHTML = track_string;
    }
};

function sendUSB(cmd){
    bc.postMessage({"send_usb": cmd});
}

function sendSerial(cmd){
    bc.postMessage({"send_serial": cmd});
}

function listTracks(){
    bc.postMessage("list_tracks");
}

function FIND(id) {
    let ret = document.getElementById(id);
    if (!ret) {
        console.log("Failed to find " + id);
    }
    return ret;
}

function make_select(list, value, fn) {
    let i;
    if (!fn) fn = str => str.toLowerCase();
    if (!list) list = [];
    let contains_value = false;
    for (i = 0; i < list.length; i++) {
        if (value === list[i]) {
            contains_value = true;
            break;
        }

    }
    if (!contains_value) {
        list = list.slice();
        list.push(value);
    }

    let ret = "";
    for (i = 0; i < list.length; i++) {
        ret += "<option value='" + list[i] + "' ";
        if (value === list[i]) ret += " selected";
        ret += ">" + fn(list[i]) + "</option>";
    }
    return ret;
}

function style_arg_edits(blade, style) {
    let ret = "";
    if (named_styles[style]) {
        const args = named_styles[style].ARGS;
        const template_id = named_styles[style].TEMPLATE;

        for (let i = 0; i < args.length; i++) {
            console.log(args[i]);

            let value = arg_storage[template_id + "." + i];
            const title = args[i][1].replaceAll(" ", "&nbsp;");

            console.log(title);
            console.log(value);

            if (!value) {
                value = args[i][2];
            }

            console.log(value);

            if (args[i][0] === "INT") {
                //ret += "<br>" + title;
                //ret += " <input type=text id=style_field" + blade + "." + i + " class=myinput onchange='SaveStyle(" + blade + ")' value=" + value + "><br>";

                ret += "<tr>";
                ret += "<td>" + title + "</td>";
                ret += "<td><input type=text id=style_field" + blade + "." + i + " class=myinput onchange='SaveStyle(" + blade + ")' value=" + value + "></td>";
                ret += "</tr>";
            }

            if (args[i][0] === "COLOR") {
                //ret += "<br>" + title;
                //ret += " <input type=color id=style_field" + blade + "." + i + " class=custom onchange='SaveStyle(" + blade + ")' value=" + from16bitcolor(value) + "><br>";

                ret += "<tr>";
                ret += "<td>" + title + "</td>";
                ret += "<td><input type=color id=style_field" + blade + "." + i + " class=custom onchange='SaveStyle(" + blade + ")' value=" + from16bitcolor(value) + "></td>";
                ret += "</tr>";
            }
        }
    }
    return ret;
}

function style_field_height(style) {
    if (named_styles[style]) {
        const l = named_styles[style].ARGS.filter(arg => arg[0] != "VOID").length;
        return (l * 2 + 5) * 42;
    }
    return 300;
}

function make_style_field(blade, value) {
    arg_storage = {};
    let fields = value.split(' ');
    let style = fields[0];
    fields = fields.slice(1);

    if (style === "builtin") {
        const style_and_args = style + " " + fields[0] + " " + fields[1];

        if (named_styles[style_and_args]) {
            style = style_and_args;
            fields = fields.slice(2);
        }
    }

    let ret = "<div class=setting_preset id='style_edit" + blade + "'>";
    ret += "<span>Blade " + blade + "</span><br>";
    ret += "<select class=myselect id=style_select" + blade + " onchange='OnStyleSelect(" + blade + ")'>";
    ret += make_select(style_lines, style);
    ret += "</select>";

    const template_id = named_styles[style].TEMPLATE;

    for (let i = 0; i < fields.length; i++) {
        arg_storage[template_id + "." + i] = fields[i];
    }

    ret += "<table id=style_container" + blade + ">";
    ret += style_arg_edits(blade, style);
    ret += "";
    ret += "</table>";
    ret += "</div>\n";
    return ret;
}

function OnStyleSelect(blade) {
    const style_select = FIND('style_select' + blade);
    const style = style_select.value;
    const style_container = FIND('style_container' + blade);
    style_container.innerHTML = style_arg_edits(blade, style);

    const style_edit = FIND('style_edit' + blade);
    const height = style_field_height(style);
    style_edit.style.height = height + "px";

    SaveStyle(blade);
}

function SaveStyle(blade) {
    const style_select = FIND('style_select' + blade);
    const style = style_select.value;
    let ret = [style];
    const args = named_styles[style].ARGS;
    const template_id = named_styles[style].TEMPLATE;
    for (let i = 0; i < args.length; i++) {
        const form_field = FIND('style_field' + blade + '.' + i);
        let val;
        if (form_field) {
            val = form_field.value;
            if (val[0] == '#') {
                val = to16bitcolor(val);
            }
        } else {
            val = "~";
        }
        arg_storage[template_id + "." + i] = val;
        ret.push(val);
    }

    console.log("***SAVE STYLE***");
    console.log(ret);
    ret = ret.join(" ");
    presets[current_preset_num]["STYLE" + blade] = ret;
    Send("set_style" + blade + " " + ret);
    SetPreset(current_preset_num) //to make sure it takes immediate effect
}

function SaveName() {
    const name_input = FIND('name_input');
    console.log("SAVE NAME " + name_input.value);
    if (presets[current_preset_num].NAME !== name_input.value) {
        presets[current_preset_num].NAME = name_input.value;
        Send("set_name " + name_input.value);
    }
    const preset_tags = document.getElementsByClassName('preset');
    UpdatePresets();
}

function make_name_field(value) {
    return "<div class=setting><span class=title>Name<br><input style='width: 90%' type=text class=myinput id=name_input value='" + value + "' onchange='SaveName()'></span></div>\n";
}

function SaveVariation() {
    const variation_slider = FIND('variation_slider');
    console.log("SAVE VARIATION " + variation_slider.value);
    if (presets[current_preset_num].VARIATION != variation_slider.value) {
        presets[current_preset_num].VARIATION = variation_slider.value;
        Send("variation " + variation_slider.value);
    }
    const variation_field = FIND('variation_field');
    if (variation_field.value != variation_slider.value) {
        variation_field.value = variation_slider.value; //update numeric value when altered by slider
    }
    const preset_tags = document.getElementsByClassName('preset');
    //	SetPreset(current_preset_num) //no need, variation is always updates directly
    UpdatePresets();
}

function SetVariation() {
    const set_variation_field = FIND('variation_field');
    console.log("SET VARIATION " + set_variation_field.value);
    const set_variation_slider = FIND('variation_slider');
    set_variation_slider.value = set_variation_field.value;
    SaveVariation(); // now do the actual update
}

function UpdateVariation(value) {
    value = parseInt(value, 10);
    const set_variation_slider = FIND('variation_slider');
    const set_variation_field = FIND('variation_field');
    let tmp = parseInt(set_variation_field.value, 10);
    tmp += value;
    tmp &= 32767;  //clamp between min and max slider value, rollover to 0 when too high, rollback to 32767 when negative
    console.log("SET VARIATION " + tmp);
    set_variation_slider.value = tmp;
    set_variation_field.value = tmp;
    SaveVariation(); // now do the actual update
}

function make_variation_field(value) {
    let ret = "<div class=setting>";
    ret += "<span class=title>Variation<br><input type=range min=0 max=32767 class=slider id=variation_slider value='" + value + "' onchange='SaveVariation()'><br>";
    ret += "<input class=myinput2 type='button' id=variation_decrease value='-' onclick='UpdateVariation(-1)' />";
    ret += "<input class=myinput type='number' id=variation_field onchange='SetVariation()' value=" + value + " />";
    ret += "<input class=myinput2 type='button' id=variation_increase value='+' onclick='UpdateVariation(1)' />";
    ret += "</span></div>\n";
    return ret;
}

function SaveFont() {
    const font_select = FIND('font_select');
    console.log("SAVE FONT " + font_select.value);
    if (presets[current_preset_num].FONT !== font_select.value) {
        presets[current_preset_num].FONT = font_select.value;
        Send("set_font " + font_select.value);
        SetPreset(current_preset_num) //to make sure it takes immediate effect
    }
}

function make_font_field(value) {
    let ret = "<div class=setting><span class=title>Font<br><select class=myselect id=font_select name=font_select onchange='SaveFont()'>";
    ret += make_select(font_lines, value);
    ret += "</select></span></div>\n";
    return ret;
}

function SaveTrack() {
    const track_select = FIND('track_select');
    console.log("SAVE TRACK " + track_select.value);
    if (presets[current_preset_num].TRACK !== track_select.value) {
        presets[current_preset_num].TRACK = track_select.value;
        Send("set_track " + track_select.value);
        SetPreset(current_preset_num) //to make sure it takes immediate effect
    }
}

function make_track_field(value) {
    let ret = "<div class=setting><span class=title>Track<br><select class=myselect id=track_select onchange='SaveTrack()'>";
    ret += make_select(track_lines, value);
    ret += "</select></span></div>\n";
    return ret;
}

function updateEditPane(preset) {
    // TODO: We shouldn't do this part every 5 seconds!
    let tmp = "";
    tmp += make_name_field(presets[preset].NAME) + "<br>";
    tmp += make_font_field(presets[preset].FONT) + "<br>";
    tmp += make_track_field(presets[preset].TRACK) + "<br>";
    tmp += make_variation_field(presets[preset].VARIATION);
    tmp += "";

    for (let blade = 1; presets[preset]["STYLE" + blade]; blade++) {
        tmp += make_style_field(blade, presets[preset]["STYLE" + blade]);
    }

    const edit_pane = FIND('contentEdit');
    edit_pane.innerHTML = tmp;
}

function showCurrentPreset(preset) {
    preset = parseInt(preset);
    if (current_preset_num === preset) return;
    current_preset_num = preset;
    updateCurrentPreset();
}

function updateCurrentPreset() {
    const preset_tags = document.getElementsByClassName('preset');
    for (let i = 0; i < preset_tags.length; i++) {
        if (i === current_preset_num) {
            preset_tags[i].style.background = '#505080';
        } else {
            preset_tags[i].style.background = '#101040';
        }
    }
    if (currentMode === "edit")
        updateEditPane(current_preset_num);
}

function showCurrentTrack(track) {
    if (track_string !== "") {
        const track_tags = document.getElementsByClassName('track');
        for (let i = 0; i < track_lines.length; i++) {
            if (track_lines[i] === track) {
                track_tags[i].style.background = '#505080';
            } else {
                track_tags[i].style.background = '#101040';
            }
        }
    }
}

async function SetPreset(n) {
    //  showCurrentPreset(n);
    await Send("set_preset " + n);
    showCurrentPreset(n);
}

async function StartDrag(n) {
    console.log('DRAG ' + n);
    //  showCurrentPreset(n);
    dragging = n;
    Send("set_preset " + n);
    showCurrentPreset(n);
}

async function DropEvent(n) {
    console.log('DROP ' + n);
    //  showCurrentPreset(n);
    if (n === dragging) {
        return;
    }
    Send("move_preset " + n);
    const x = presets[dragging];
    presets = presets.slice(0, dragging).concat(presets.splice(dragging + 1, presets.length));
    presets = presets.slice(0, n).concat([x], presets.slice(n, presets.length));
    UpdatePresets();
}

async function AddPreset() {
    const r = confirm("Duplicate current preset?");
    if (r == true) {
        Send("duplicate_preset " + presets.length);
        presets.push(Object.assign({}, presets[current_preset_num]));
        UpdatePresets();
    }
}

async function DelPreset() {
    if (current_preset_num >= 0 &&
        current_preset_num < presets.length &&
        presets.length > 1) {
        Send("delete_preset " + current_preset_num);
        presets.splice(current_preset_num, 1);
        current_preset_num = -1;
        SetPreset(0);
    }
    UpdatePresets();
}

async function DelConfirm() {
    const r = confirm("Delete current preset?");
    if (r == true) {
        DelPreset();
    }
}

async function PlayTrack(track) {
    await Send("play_track " + track);
    showCurrentTrack(track);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function UpdateSlider(cmd, slider, label, fn) {
    const slider_tag = FIND(slider);
    const label_tag = FIND(label);

    let value = slider_tag.value;
    label_tag.innerHTML = value + "%";

    if (updating_sliders[slider]) return;

    updating_sliders[slider] = true;
    await Send(cmd + " " + (fn ? fn(value) : value));
    updating_sliders[slider] = false;
}

function ToggleMode(mode) {
    if (currentMode === mode) {
        currentMode = "normal";
    } else {
        currentMode = mode;
    }
    UpdateMode();
}

function ToggleEditMode() {
    ToggleMode("edit");
}

function ToggleSettingsMode() {
    ToggleMode("settings");
}

function UpdatePresets() {
    let preset_string = "";
    for (let i = 0; i < presets.length; i++) {
        const p = presets[i];
        if (currentMode === "edit") {
            preset_string += "<div draggable=true class=preset ondragstart='StartDrag(" + i + ")' onclick='SetPreset(" + i + ")'  ondrop='DropEvent(" + i + ")'  ondoubleclick='EditPreset(" + i + ")' ondragover='return false'>";
        } else {
            preset_string += "<div class=preset onclick='SetPreset(" + i + ")'>";
        }
        preset_string += "<span class=title>" + p.NAME.replace("\\n", "<br>") + "</span>";
        preset_string += "</div>";
    }
    if (currentMode === "edit") {
        preset_string += "<div class=preset onclick='AddPreset()'>";
        preset_string += "<span class=title>+</span>";
        preset_string += "</div>";
        preset_string += "<div class=preset ondrop='DelPreset()' onclick=DelConfirm()>";
        preset_string += "<span class=title>&#x1F5D1;</span>";
        preset_string += "</div>";
    }
    FIND('presets').innerHTML = preset_string;
    updateCurrentPreset(current_preset_num);
}

async function generateBoolSetting(base_cmd, variable, label) {
    const value = await Send("get_" + base_cmd + " " + variable);

    if (value.startsWith("Whut?")) return "";
    if (value.trim() === "") return "";

    const checked = parseFloat(value) > 0.5 ? "checked" : "";

    return "<div class=setting><span class=title>" + label +
        ": <input type=checkbox class=mycheck id=bool_setting_" + base_cmd + "_" + variable + " " + checked +
        " onchange=\"SaveBoolSetting('" + base_cmd + "','" + variable + "')\"></span></div>\n";
}

function SaveBoolSetting(base_cmd, variable) {
    const value = FIND("bool_setting_" + base_cmd + "_" + variable).checked ? "1" : "0";
    Send("set_" + base_cmd + " " + variable + " " + value);
}

async function generateIntSetting(base_cmd, variable, label) {
    let value = await Send("get_" + base_cmd + " " + variable);
    if (value.startsWith("Whut?")) return "";
    if (value.trim() === "") return "";
    value = Math.round(parseFloat(value));
    return "<div class=setting><span class=title>" + label +
        "<br><input type=text class=myinput id=int_setting_" + base_cmd + "_" + variable + " value='" + value + "'" +
        " onchange=\"SaveIntSetting('" + base_cmd + "','" + variable + "')\"></span></div>\n";
}

function SaveIntSetting(base_cmd, variable) {
    const value = FIND("int_setting_" + base_cmd + "_" + variable).value;
    Send("set_" + base_cmd + " " + variable + " " + value);
}

async function UpdateSettings() {
    FIND("contentSettings").innerHTML = "...";
    let html = "";

    const dimming = await Send("get_blade_dimming");

    if (!dimming.startsWith("Whut?")) {
        const dim_percent = Math.round(Math.pow(parseInt(dimming) / 16384.0, 1.0 / 2.2) * 100);
        html += "<div class=setting id=brightness_setting><span class=title>Brightness<input type=range min=1 max=100 class=slider style='width:90%' id=brightness_input value='" + dim_percent + "' onchange='SaveBrightness()' oninput='SaveBrightness()'><span id=brightness_number>" + dim_percent + "%</span></span></div>\n";
    }
    let threshold = await Send("get_clash_threshold");

    if (!threshold.startsWith("Whut?")) {
        threshold = threshold.trim();
        html += "<div class=setting id=clash_threshold_setting><span class=title>Clash&nbsp;Threshold<input type=range min=0.5 max=6.0 step=0.05 class=slider style='width:90%' id=clash_threshold_input value='" + threshold + "' onchange='SaveClashThreshold()' oninput='SaveClashThreshold()'><span id=clash_threshold_number>" + threshold + "</span></span></div>\n";
    }

    if (max_blade_length) {
        let blade = 1;
        while (true) {
            const tmp = await Send("get_blade_length " + blade);
            if (tmp.startsWith("Whut?")) break;
            let blade_length = parseInt(tmp);
            max_blade_length = parseInt(await Send("get_max_blade_length " + blade));
            if (blade_length === -1) {
                blade_length = max_blade_length;
            }
            if (!blade_length) break;
            html += "<div class=setting><span class=title>Blade " + blade + " length<br><input type=text class=myinput id=blade_length_input_" + blade + " value='" + blade_length + "' onchange='SaveBladeLength(" + blade + "," + max_blade_length + ")'></span></div>\n";
            blade++;
        }
    }

    html += await generateBoolSetting("gesture", "gestureon", "gesture ignition");
    html += await generateBoolSetting("gesture", "swingon", "swing ignition");
    html += await generateIntSetting("gesture", "swingonspeed", "swing on speed");
    html += await generateBoolSetting("gesture", "twiston", "twist ignition");
    html += await generateBoolSetting("gesture", "thruston", "thrust ignition");
    html += await generateBoolSetting("gesture", "stabon", "stab ignition");
    html += await generateBoolSetting("gesture", "twistoff", "twist off");
    html += await generateBoolSetting("gesture", "powerlock", "power lock");
    html += await generateBoolSetting("gesture", "forcepush", "force push");
    html += await generateIntSetting("gesture", "forcepushlen", "force push length");
    html += await generateIntSetting("gesture", "lockupdelay", "lockup delay");
    html += await generateIntSetting("gesture", "clashdetect", "clash detect");
    html += await generateIntSetting("gesture", "maxclash", "max clash strength");

    FIND("contentSettings").innerHTML = html;
}

function SaveBladeLength(blade, max_length) {
    const tag = FIND("blade_length_input_" + blade);
    let length = tag.value;
    if (length > max_length) {
        length = max_length;
    }
    tag.value = length;
    Send("set_blade_length " + blade + " " + length);
}

function SaveBrightness() {
    UpdateSlider("set_blade_dimming", "brightness_input", "brightness_number",
        dim_percent => Math.round(Math.pow(dim_percent / 100.0, 2.2) * 16384));
}

function SaveClashThreshold() {
    const threshold = FIND("clash_threshold_input").value;
    Send("set_clash_threshold " + threshold);
    const threshold_label = FIND("clash_threshold_number");
    threshold_label.innerHTML = threshold;
}

async function GetList(cmd) {
    const s = await Send(cmd);
    if (s.startsWith("Whut?")) {
        return [];
    }
    const ret = s.split("\n");
    ret.pop();  // remove empty line at end
    return ret;
}

async function HasCmd(cmd) {
    const s = await Send(cmd);
    return !s.startsWith("Whut?");
}

async function HasDir(dir) {
    const entries = await GetList("dir " + dir);
    return !(entries.length === 1 && entries[0] === "No such directory.");
}

function from16bitlinear(val) {
    val = parseInt(val);
    val = Math.round(Math.pow(val / 65535.0, 1.0 / 2.2) * 255.0);
    return Number(1024 + val).toString(16).slice(-2);
}

function from16bitcolor(val) {
    val = val.split(",");
    return "#" + from16bitlinear(val[0]) + from16bitlinear(val[1]) + from16bitlinear(val[2]);
}

function to16bitlinear(val) {
    val = parseInt(val, 16);
    val = Math.round(Math.pow(val / 255.0, 2.2) * 65535);
    return val;
}

function to16bitcolor(val) {
    return to16bitlinear(val.substr(1, 2)) + "," +
        to16bitlinear(val.substr(3, 2)) + "," +
        to16bitlinear(val.substr(5, 2));
}

function concatTypedArrays(a, b) { // a, b TypedArray of same type
    const c = new (a.constructor)(a.length + b.length);
    c.set(a, 0);
    c.set(b, a.length);
    return c;
}



listTracks();
