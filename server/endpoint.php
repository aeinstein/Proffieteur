<?php


switch ($_REQUEST["cmd"]){
    case "compile":
        $serial = $_REQUEST["serial"];

        $compiler = new ArduinoCLI_Wrapper();


        moveConfig($serial);
        $compiler->compile($serial);
        break;

    case "upload":
        break;
}



function moveConfig($serial){
    $dir = "tmp/".$serial;

    $compiler = new ArduinoCLI_Wrapper();
    $dest = $compiler->getSourceDir()."/config/".$serial;

    rmdir($dest);
    mkdir($dest);

    createConfigTemplate($dest);


    if (is_dir($dir)) {
        $files = scandir($dir);

        foreach ($files as $file){
            copy($dir."/".$file, $dest);
        }

    } else {
        echo "Error: ConfigDir not found";
    }
}

function createConfigTemplate($dir){
    $config = "// ProffieOS7 Config File
#define DOSFS_SDCARD 2

#ifdef CONFIG_TOP
#include \"../../proffieboard_v3_config.h\"
#include \"top.h\"
#endif

#ifdef CONFIG_PROP
#include \"../../../props/saber_fett263_buttons.h\"
#endif

#ifdef CONFIG_PRESETS
#include \"presets.h\"
#include \"blades.h\"
#endif

#ifdef CONFIG_BUTTONS
#include \"buttons.h\"
#endif

#ifdef CONFIG_STYLES
#include \"styles.h\"
#endif
";

    file_put_contents($dir."/config.h", $config);
}