import path = require('path');
import task = require('azure-pipelines-task-lib/task');
import tool = require('azure-pipelines-tool-lib/tool');

const ARDUINOCLI_TOOL_PATH_ENV_VAR: string = "ArdunioCliToolPath";
const ARDUINOCLI_TOOL_NAME: string = 'arduino-cli';

async function run() {
    try {
        let localArduinoCli = task.getVariable(ARDUINOCLI_TOOL_PATH_ENV_VAR) || process.env[ARDUINOCLI_TOOL_PATH_ENV_VAR] || task.getInput(ARDUINOCLI_TOOL_PATH_ENV_VAR, false);
       
        if(localArduinoCli === undefined) {
            task.setResult(task.TaskResult.Failed, `Couldn't find ${ARDUINOCLI_TOOL_PATH_ENV_VAR} variable! Please run arduino-cli install task first.`);
            return;
        }

        // Example:
        // arduino-cli compile -b arduino:avr:uno /home/user/Arduino/MySketch

        let fullPath = path.join(localArduinoCli, ARDUINOCLI_TOOL_NAME);

        var args = ["compile"];

        let fqbn = task.getInput("fqbn", true);
        args.push(`--fqbn=${fqbn}`);

        let outputDir = task.getPathInput("outputDir", false);
        if(outputDir != undefined)
            args.push(`--output-dir=${outputDir}`);

        // Options

        let buildCachePath = task.getPathInput("buildCachePath", false);
        if(buildCachePath != undefined)
            args.push(`--build-cache-path=${buildCachePath}`);

        let buildPath = task.getPathInput("buildPath", false);
        if(buildPath != undefined)
            args.push(`--build-path=${buildPath}`);

        let buildProperty = task.getInput("buildProperty", false);
        if(buildProperty != undefined)
            args.push(`--build-property=${buildProperty}`);

        let clean = task.getBoolInput("clean", false);
        if(clean)
            args.push(`--clean`);

        let exportBinaries = task.getBoolInput("exportBinaries", false);
        if(exportBinaries)
            args.push(`--export-binaries`);

        let libraries = task.getInput("libraries", false);
        if(libraries != undefined)
            args.push(`--libraries=${libraries}`);
        
        let onlyCompilationDatabase = task.getBoolInput("onlyCompilationDatabase", false);
        if(onlyCompilationDatabase)
            args.push(`--only-compilation-database`);
        
        let optimizeForDebug = task.getBoolInput("optimizeForDebug", false);
        if(optimizeForDebug)
            args.push(`--optimize-for-debug`);

        let vidPid = task.getInput("vidPid", false);
        if(vidPid != undefined)
            args.push(`--vid-pid=${vidPid}`);

        let warnings = task.getInput("warnings", false);
        if(warnings != undefined)
            args.push(`--warnings=${warnings}`);
        
        // Options inherited from parent commands

        let additionalUrls = task.getInput("additionalUrls", false);
        if(additionalUrls != undefined)
            args.push(`--additional-urls=${additionalUrls}`);

        let configFile = task.getPathInput("configFile", false);
        if(configFile != undefined)
            args.push(`--config-file=${configFile}`);

        let format = task.getInput("format", false);
        if(format != undefined)
            args.push(`--format=${format}`);
        
        let logFile = task.getPathInput("logFile", false);
        if(logFile != undefined)
            args.push(`--log-file=${logFile}`);

        let logFormat = task.getInput("logFormat", false);
        if(logFormat != undefined)
            args.push(`--log-format=${logFormat}`);

        let logLevel = task.getInput("logLevel", false);
        if(logLevel != undefined)
            args.push(`--log-level=${logLevel}`);

        let verbose = task.getBoolInput("verbose", false);
        if(verbose)
            args.push(`--verbose`);

        // Sketch to compile
        let sketchDir = task.getPathInput("sketchDir", true);
        args.push(`${sketchDir}`);
        
        let result = await task.exec(fullPath, args);
        task.debug(`Executed with args ${args}:  '${result}'`);
        
        if(result == 0) {
            task.setResult(task.TaskResult.Succeeded, "Build!");
            return;
        }
        
        task.setResult(task.TaskResult.Failed, "Error while building!");
        return;
    }
    catch (err) {
        task.error(err.message);
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();