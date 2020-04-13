import os = require('os');
import request = require('request-promise');
import task = require('azure-pipelines-task-lib/task');
import tool = require('azure-pipelines-tool-lib/tool');

const ARDUINOCLI_TOOL_PATH_ENV_VAR: string = "ArdunioCliToolPath";
const ARDUINOCLI_TOOL_NAME: string = 'arduino-cli';

async function run() {
    try {
        let platform = findPlatform();
        let arch = findArch();
        let version = task.getInput('version', true);
        if (version === undefined || version === 'latest' || version === '')
            version = await findLatestSdkVersion();
        
        let platfromAndArch = `${platform}_${arch}`;

        // check if arduino-cli is already installed
        var localArduinoCli = tool.findLocalTool(ARDUINOCLI_TOOL_NAME, version, platfromAndArch);

        if (!localArduinoCli) {
            // download, install and cache arduino-cli
            await downloadAndInstallArduinoCli(version, platform, arch);

            // verify is installed
            localArduinoCli = tool.findLocalTool(ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
            if(localArduinoCli === undefined) {
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
}

async function findLatestSdkVersion(): Promise<string>{
    let headers = {
        'Accept': 'application/json'
    };
    let body = await request.get({headers: headers, uri: "https://github.com/arduino/arduino-cli/releases/latest"});
    let json = JSON.parse(body);
    return json.tag_name
}

async function downloadAndInstallArduinoCli(version: string, platform: string, arch: string): Promise<void> {
    let platfromAndArch = `${platform}_${arch}`;
    if(platform == "Windows") {
        tool.debug("Downloading bundle");
        let toolFile = await tool.downloadTool(`https://github.com/arduino/arduino-cli/releases/download/${version}/arduino-cli_${version}_${platform}_${arch}.zip`);
        let bundleDir = await tool.extractZip(toolFile);

        tool.cacheDir(bundleDir, ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
    }
    else {
        tool.debug("Downloading bundle");
        let toolFile = await tool.downloadTool(`https://github.com/arduino/arduino-cli/releases/download/${version}/arduino-cli_${version}_${platform}_${arch}.tar.gz`);
        let bundleDir = await tool.extractTar(toolFile);

        tool.cacheDir(bundleDir, ARDUINOCLI_TOOL_NAME, version, platfromAndArch);
    }
}

function findPlatform() {
	if (os.platform() === 'darwin')
		return "macOS";
	else if (os.platform() === 'linux')
		return "Linux";
    return "Windows";
}

function findArch() {
    
    if(os.arch() == 'x64')
        return '64bit';
    else if(os.arch() == 'x32')
        return "32bit";
    // else if(os.arch() == 'arm')
    //     return 'arm'; // TODO: ARMv6 or ARMv7
    else if(os.arch() == 'arm64')
        return "ARM64";
    else
        throw Error("Unsupported arch type!");
}

run();