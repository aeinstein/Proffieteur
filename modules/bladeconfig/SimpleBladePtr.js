const leds = JSON.parse(localStorage.leds || "{}");

function addNewLED(){
    showTemplate("tmpNewLED");
}

function saveLed(){
    if(getValue("LedName") === "") {
        alert("Please provide a name for the LED.");
        setFocus("LedName");
        return;
    }

    if(getValue("MaxAmps") === "") {
        alert("Please provide MaxAmps for the LED.");
        setFocus("MaxAmps");
        return;
    }

    if(getValue("MaxVolts") === "") {
        alert("Please provide MaxVolts for the LED.");
        setFocus("MaxVolts");
        return;
    }

    if(getValue("P2Amps") === "") {
        alert("Please provide P2Amps for the LED.");
        setFocus("P2Amps");
        return;
    }

    if(getValue("P2Volts") === "") {
        alert("Please provide P2Volts for the LED.");
        setFocus("P2Volts");
        return;
    }

    if(getValue("Resistor") === "") {
        alert("Please provide Resistor for the LED.");
        setFocus("Resistor");
        return;
    }

    leds[getValue("LedName")] = {
        MaxAmps: getValue("MaxAmps"),
        MaxVolts: getValue("MaxVolts"),
        P2Amps: getValue("P2Amps"),
        P2Volts: getValue("P2Volts"),
        Resistor: getValue("Resistor"),
        Color: getValue("Color")
    }

    // check values

    localStorage.setItem('leds', JSON.stringify(leds));

    hideTemplate();
}

function refreshSimpleBlade(){
    removeAllLEDs();
    addBuiltInLEDs();

    for(const led in leds) {
        addOptionToAllLEDs(led);
    }
}

function selectLEDTemplate(){
    const values = getValue("ledTemplate").split(";");
    setValue("MaxAmps", values[0]);
    setValue("MaxVolts", values[1]);
    setValue("P2Amps", values[2]);
    setValue("P2Amps", values[3]);
    setValue("Resistor", values[4]);
    setValue("Color", values[5]);
}

function addBuiltInLEDs(){
    addOptionToAllLEDs("NoLED");
    addOptionToAllLEDs("CreeXPE2White");
    addOptionToAllLEDs("CreeXPE2Blue");
    addOptionToAllLEDs("CreeXPE2Green");
    addOptionToAllLEDs("CreeXPE2PCAmber");
    addOptionToAllLEDs("CreeXPE2Red");
    addOptionToAllLEDs("CreeXPE2RedOrange");
    addOptionToAllLEDs("CreeXPE2Amber");
    addOptionToAllLEDs("CreeXPL");
}

function removeAllLEDs(){
    removeAllOptions("led1");
    removeAllOptions("led2");
    removeAllOptions("led3");
    removeAllOptions("led4");
}

function addOptionToAllLEDs(option){
    addOption("led1", option);
    addOption("led2", option);
    addOption("led3", option);
    addOption("led4", option);
}