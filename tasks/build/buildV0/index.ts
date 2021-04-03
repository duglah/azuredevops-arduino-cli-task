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

        let sketchDir = task.getInput("sketchDir", true);
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