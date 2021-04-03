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
const os = require("os");
const request = require("request-promise");
const task = require("azure-pipelines-task-lib/task");
const tool = require("azure-pipelines-tool-lib/tool");
const ARDUINOCLI_TOOL_PATH_ENV_VAR = "ArdunioCliToolPath";
const ARDUINOCLI_TOOL_NAME = 'arduino-cli';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let platform = findPlatform();
            let arch = findArch();
            let version = task.getInput('version', true);
            if (version === undefined || version === 'latest' || version === '')
                version = yield findLatestSdkVersion();
            let platfromAndArch = `${platform}_${arch}`;
            // check if arduino-cli is already installed
            var localArduinoCli = tool.findLocalTool(ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
            if (!localArduinoCli) {
                // download, install and cache arduino-cli
                yield downloadAndInstallArduinoCli(version, platform, arch);
                // verify is installed
                localArduinoCli = tool.findLocalTool(ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
                if (localArduinoCli === undefined) {
                    task.setResult(task.TaskResult.Failed, `Couldn't find ${ARDUINOCLI_TOOL_NAME} in local tools! Something went wrong while installing.`);
                    return;
                }
            }
            // set enviroment variables
            task.debug(`Set ${ARDUINOCLI_TOOL_PATH_ENV_VAR} with '${localArduinoCli}'`);
            task.setVariable(ARDUINOCLI_TOOL_PATH_ENV_VAR, localArduinoCli);
            task.setResult(task.TaskResult.Succeeded, "Installed");
            return;
        }
        catch (err) {
            task.error(err.message);
            task.setResult(task.TaskResult.Failed, err.message);
        }
    });
}
function findLatestSdkVersion() {
    return __awaiter(this, void 0, void 0, function* () {
        let headers = {
            'Accept': 'application/json'
        };
        let body = yield request.get({ headers: headers, uri: "https://github.com/arduino/arduino-cli/releases/latest" });
        let json = JSON.parse(body);
        return json.tag_name;
    });
}
function downloadAndInstallArduinoCli(version, platform, arch) {
    return __awaiter(this, void 0, void 0, function* () {
        let platfromAndArch = `${platform}_${arch}`;
        if (platform == "Windows") {
            tool.debug("Downloading bundle");
            let toolFile = yield tool.downloadTool(`https://github.com/arduino/arduino-cli/releases/download/${version}/arduino-cli_${version}_${platform}_${arch}.zip`);
            let bundleDir = yield tool.extractZip(toolFile);
            tool.cacheDir(bundleDir, ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
        }
        else {
            tool.debug("Downloading bundle");
            let toolFile = yield tool.downloadTool(`https://github.com/arduino/arduino-cli/releases/download/${version}/arduino-cli_${version}_${platform}_${arch}.tar.gz`);
            let bundleDir = yield tool.extractTar(toolFile);
            tool.cacheDir(bundleDir, ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
        }
    });
}
function findPlatform() {
    if (os.platform() === 'darwin')
        return "macOS";
    else if (os.platform() === 'linux')
        return "Linux";
    return "Windows";
}
function findArch() {
    if (os.arch() == 'x64')
        return '64bit';
    else if (os.arch() == 'x32')
        return "32bit";
    else if (os.arch() == 'arm')
        return 'ARMv7'; // Only support ARMv7, because Azure DevOps only supports ARMv7 agents. See https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-linux?view=azure-devops#check-prerequisites
    else if (os.arch() == 'arm64')
        return "ARM64";
    else
        throw Error("Unsupported arch type!");
}
run();
//# sourceMappingURL=index.js.map