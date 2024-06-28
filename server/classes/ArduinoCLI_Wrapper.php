<?php

class ArduinoCLI_Wrapper {
    private $config;
    private $cmd = "/usr/bin/arduino-cli";
    private $fqbn = "proffieboard:stm32l4:ProffieboardV3-L452RE";
    private $source_dir = "/CRYPTED/RAID/installs/ProffieOS";
    private $source_ino = "ProffieOS.ino";
    private $additional_urls = "https://profezzorn.github.io/arduino-proffieboard/package_proffieboard_index.json";
    private $output_dir = "";
    /**
     * @var mixed
     */
    private $verbose = false;

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

    function compile($serial){
        $cmdline = $this->cmd." compile ";
        $cmdline .= " --fqbn ".$this->fqbn;
        $cmdline .= " ".$this->source_dir."/".$this->source_ino;
        $cmdline .= " --additional-urls ".$this->additional_urls;
        $cmdline .= " --output-dir ".$this->output_dir;
        if($this->verbose) $cmdline .= " --verbose";

        $build_props = "compiler.cpp.extra_flags=\"-DCONFIG_FILE=\\\"config/webconfig/".$serial."/config.h\\\"\"";
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
