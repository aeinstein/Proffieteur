
# Proffieteur
### Proffieboard Diagnostics
WebAPP for basic diagnostics, full configuration and direct upload of Proffieboards, via WebUSB and WebSerial. 
Based on original work from [profezzorn](https://github.com/profezzorn).

# Only ProffieboardV3 for now !!!

![](/contrib/admin.PNG)

# General Config
![](/contrib/top.PNG)

# Blade Config Editor
![](/contrib/blades.PNG)

| ![](/contrib/newBladeDefinition.PNG)    | ![](/contrib/newLed.PNG) |
| ----------- | ----------- |

# Style Editor
![](/contrib/styles.PNG)

# Preset Editor
![](/contrib/presets.PNG)
![](/contrib/preset_edit.PNG)



# Server compile
![](/contrib/compile.PNG)



## This App is -- in progress --
Please no questions yet, it is IN PROGRESS !!


### Configfile structure
The Configfile splitted into single files, for easy reading and editing. In this setup every config section has its own file.
```

#ifdef CONFIG_TOP
#include "../../proffieboard_v3_config.h"
#include "top.h"
#endif

#ifdef CONFIG_PROP
#include "../../../props/saber_fett263_buttons.h"
#endif

#ifdef CONFIG_PRESETS
#include "presets.h"
#include "blades.h"
#endif

#ifdef CONFIG_BUTTONS
#include "buttons.h"
#endif

#ifdef CONFIG_STYLES
#include "styles.h"
#endif
```

### Setting Up Server Compile on Debian 12
```
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | BINDIR=/usr/bin sh

arduino-cli config init
arduino-cli core update-index
arduino-cli core install proffieboard:stm32l4 --additional-urls https://profezzorn.github.io/arduino-proffieboard/package_proffieboard_index.json
sudo dpkg --add-architecture i386
sudo apt-get update
sudo apt-get install libc6:i386 libncurses5:i386 libstdc++6:i386
```

### Features
* Console for WebUSB
* Console for WebSerial
* Create and flash new configs
* Separate build sessions for Cloud usage
* Preset builder
* Style builder
* Config "top" area


### RoadMap
* ProcessMonitor
* Config "Props" area
* More ToolTips
* Graphical Representation of "monitor fusion"
* add useful documents and manuals
* other Proffieboards

