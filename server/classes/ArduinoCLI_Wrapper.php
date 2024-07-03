<?php

class ArduinoCLI_Wrapper {
    private $config;
    private $cmd = "/usr/bin/arduino-cli";
    private $fqbn = "proffieboard:stm32l4:ProffieboardV3-L452RE:usb=cdc_webusb,dosfs=sdmmc1,opt=o3";
    private $source_dir = "/CRYPTED/RAID/installs/ProffieOS";
    private $source_ino = "ProffieOS.ino";
    private $additional_urls = "https://profezzorn.github.io/arduino-proffieboard/package_proffieboard_index.json";
    private $output_dir = "";
    private $verbose = false;
    private $enableMassStorage = false;
    private $enableWebUSB = true;

    function __construct(){
        $this->output_dir = $_SERVER["DOCUMENT_ROOT"]."/proffieteur/server/tmp/";
    }

    function setConfigDir($dir) {
        $this->config = $dir;
    }

    function setVerbose($enabled){
        $this->verbose = $enabled;
    }

    function getOutputDir(): string {
        return $this->output_dir;
    }

    function getSourceDir(): string {
        return $this->source_dir;
    }

    function clean($serial){

    }

    function compile($serial){
        $cmdline = $this->cmd." compile -v ";
        $cmdline .= " --fqbn ".$this->fqbn;
        $cmdline .= " ".$this->source_dir."/".$this->source_ino;
        $cmdline .= " --additional-urls ".$this->additional_urls;
        $cmdline .= " --output-dir ".$this->output_dir;
        if($this->verbose) $cmdline .= " --verbose";

        $build_props = "compiler.cpp.extra_flags=\"-DCONFIG_FILE=\\\"config/webconfig/".$serial."/config.h\\\"\"";
        $cmdline .= " --build-property ".$build_props;

        $args = [
            "-DSTM32L452xx",
            "-DPROFFIEBOARD_VERSION=3",
            "-D__FPU_PRESENT=1",
            "-march=armv7e-m",
            "-mthumb",
            "-mfloat-abi=hard",
            "-mfpu=fpv4-sp-d16",
            "-mabi=aapcs",
            "-mslow-flash-data",
            "-fsingle-precision-constant",
            "-felide-constructors",
            "-ffast-math",
            "-DUSB_VID=0x1209",
            "-DUSB_PID=0x6668",
            "-DUSB_DID=0xffff",
            "-DUSB_MANUFACTURER=\"hubbe.net\"",
            "-DUSB_PRODUCT=\"Proffieboard\"",
            "-DDOSFS_SDCARD=3",
            "-DDOSFS_SFLASH=0"
        ];

        $USB_TYPE = "USB_TYPE_CDC";

        if($this->enableMassStorage) $USB_TYPE .= "_MSC";
        if($this->enableWebUSB) $USB_TYPE .= "_WEBUSB";

        $args[] = "-DUSB_TYPE=".$USB_TYPE;

        $extra_flags = "";

        foreach($args as $arg){
            $extra_flags .= " ".str_replace("\"", "\\\"", $arg);
        }

        $build_props = "build.extra_flags=\"".$extra_flags."\"";
        $cmdline .= " --build-property ".$build_props;

        echo $cmdline."\n";


        $compiler = popen($cmdline." 2>&1", "r");
        $output = "";

        while(!feof($compiler)) {
            // send the current file part to the browser
            $l = fread($compiler, 1024);
            $output .= $l;
            print $l;

            // flush the content to the browser
            flush();
        }

        pclose($compiler);

        file_put_contents("/tmp/compiler_output.txt", $output);

    }
}
