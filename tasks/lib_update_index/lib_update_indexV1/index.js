"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const task = require("azure-pipelines-task-lib/task");
const ARDUINOCLI_TOOL_PATH_ENV_VAR = "ArdunioCliToolPath";
const ARDUINOCLI_TOOL_NAME = 'arduino-cli';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let localArduinoCli = task.getVariable(ARDUINOCLI_TOOL_PATH_ENV_VAR) || process.env[ARDUINOCLI_TOOL_PATH_ENV_VAR] || task.getInput(ARDUINOCLI_TOOL_PATH_ENV_VAR, false);
            if (localArduinoCli === undefined) {
                task.setResult(task.TaskResult.Failed, `Couldn't find ${ARDUINOCLI_TOOL_PATH_ENV_VAR} variable! Please run arduino-cli install task first.`);
                return;
            }
            // Example:
            // arduino-cli lib update-index [flags]
            let fullPath = path.join(localArduinoCli, ARDUINOCLI_TOOL_NAME);
            var args = ["lib", "update-index"];
            let additionalUrls = task.getInput("additionalUrls", false);
            if (additionalUrls != undefined)
                args.push(`--additional-urls=${additionalUrls}`);
            let configFile = task.getPathInput("configFile", false);
            if (configFile != undefined)
                args.push(`--config-file=${configFile}`);
            let format = task.getInput("format", false);
            if (format != undefined)
                args.push(`--format=${format}`);
            let logFile = task.getPathInput("logFile", false);
            if (logFile != undefined)
                args.push(`--log-file=${logFile}`);
            let logFormat = task.getInput("logFormat", false);
            if (logFormat != undefined)
                args.push(`--log-format=${logFormat}`);
            let logLevel = task.getInput("logLevel", false);
            if (logLevel != undefined)
                args.push(`--log-level=${logLevel}`);
            let verbose = task.getBoolInput("verbose", false);
            if (verbose)
                args.push(`--verbose`);
            let result = yield task.exec(fullPath, args);
            task.debug(`Executed with args ${args}:  '${result}'`);
            if (result == 0) {
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
    });
}
run();
//# sourceMappingURL=index.js.map