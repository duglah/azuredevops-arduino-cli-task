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
        // arduino-cli core install PACKAGER:ARCH[@VERSION] ... [flags]

        let fullPath = path.join(localArduinoCli, ARDUINOCLI_TOOL_NAME);

        var args = ["core", "install"];

        let core = task.getInput("core", true);
        args.push(`${core}`);

        let runPostInstall = task.getBoolInput("runPostInstall", false);
        if(runPostInstall)
            args.push(`--run-post-install`);

        let skipPostInstall = task.getBoolInput("skipPostInstall", false);
        if(skipPostInstall)
            args.push(`--skip-post-install`);

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