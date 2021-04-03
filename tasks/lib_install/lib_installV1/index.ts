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
        // arduino-cli lib install LIBRARY[@VERSION_NUMBER](S) [flags]

        let fullPath = path.join(localArduinoCli, ARDUINOCLI_TOOL_NAME);

        var args = ["lib", "install"];

        let installLibBy = task.getInput("installLibBy", true);
        
        if(installLibBy == "libName"){
            let lib = task.getInput("lib", false);
            if(lib != undefined)
                args.push(`${lib}`);
            else{
                task.setResult(task.TaskResult.Failed, "Please specify a library name!");
                return;
            }
        }
        else if (installLibBy == "gitUrl"){
            let gitUrl = task.getInput("gitUrl", false);
            if(gitUrl != undefined)
                args.push(`--git-url=${gitUrl}`);
            else{
                task.setResult(task.TaskResult.Failed, "Please specify a git url!");
                return;
            }
        }
        else if (installLibBy == "zipPath"){
            let zipPath = task.getPathInput("zipPath", false);
            if(zipPath != undefined)
                args.push(`--zip-path=${zipPath}`);
            else{
                task.setResult(task.TaskResult.Failed, "Please specify a zip path!");
                return;
            }
        }

        // Options inherited from parent commands

        let additionalUrls = task.getInput("additionalUrls", false);
        if(additionalUrls != undefined)
            args.push(`--additional-urls=${additionalUrls}`);

        let configFile = task.getInput("configFile", false);
        if(configFile != undefined)
            args.push(`--config-file=${configFile}`);

        let format = task.getInput("format", false);
        if(format != undefined)
            args.push(`--format=${format}`);
        
        let logFile = task.getInput("logFile", false);
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
        
        let result = await task.exec(fullPath, args);
        task.debug(`Executed with args ${args}:  '${result}'`);
        
        if(result == 0) {
            task.setResult(task.TaskResult.Succeeded, "Installed!");
            return;
        }
        
        task.setResult(task.TaskResult.Failed, "Error while installing!");
        return;
    }
    catch (err) {
        task.error(err.message);
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();