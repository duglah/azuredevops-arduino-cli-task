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
        // arduino-cli lib update-index [flags]

        let fullPath = path.join(localArduinoCli, ARDUINOCLI_TOOL_NAME);

        var args = ["lib", "update-index"];

        let additionalUrls = task.getInput("additionalUrls", false);
        if(additionalUrls != undefined)
            args.push(`--additional-urls=${additionalUrls}`);
        
        let result = await task.exec(fullPath, args);
        task.debug(`Executed with args ${args}:  '${result}'`);
        
        if(result == 0) {
            task.setResult(task.TaskResult.Succeeded, "Updated core index!");
            return;
        }
        
        task.setResult(task.TaskResult.Failed, "Error while updating core index!");
        return;
    }
    catch (err) {
        task.error(err.message);
        task.setResult(task.TaskResult.Failed, err.message);
    }
}

run();