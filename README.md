# arduino-cli for Azure DevOps
Inofficial community implementation of [arduino-cli](https://arduino.github.io/arduino-cli/) task for [Azure DevOps](https://azure.microsoft.com/de-de/services/devops/).

# Installation
Install via [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=PhilippManstein.arduino-cli).

# Usage
Example usage for Azure DevOps and detailed description of tasks and arguments.

## Example azure-pipelines.yml
Basic example script for building [Blink example](Main/Main.ino) on Azure DevOps for Arduino Uno. 
See [azure-pipelines.yml](azure-pipelines.yml):
```yaml
trigger:
- master

pool:
  vmImage: 'ubuntu-latest'

steps:
- task: ArduinoCliInstall@0
  inputs:
    version: 'latest'

- task: ArduinoCliCoreUpdateIndex@0

- task: ArduinoCliCoreInstall@0
  inputs:
    core: 'arduino:avr'

- task: ArduinoCliBuild@0
  inputs:
    fqbn: 'arduino:avr:uno'
    sketchDir: '$(System.DefaultWorkingDirectory)/Main'
```

1. Pipeline triggers on commit on `master` on `ubuntu-latest``
2. Installs latest arduino-cli with task `ArduinoCliInstall@0`
3. "The first thing to do upon a fresh install is to update the local cache of available platforms and libraries by running" [Getting started](https://arduino.github.io/arduino-cli/getting-started/#connect-the-board-to-your-pc), so run task `ArduinoCliCoreUpdateIndex@0`
4. Install core for `arduino:avr` in task `ArduinoCliCoreInstall@0`
5. Build [Main/Main.ino](Main/Main.ino) for Arudino Uno with task `ArduinoCliBuild@0`

## install
Installs arduino-cli to agent, when not installed already.
- Set specific `version`, for example `0.9.0` or as `latest`to install arduino-cli

## core update-index
Updates the index of cores.
- *(Optional)* Set `Additional URLs for the board manager`

## core install
Installs additionals cores.
- Set `core name` to install core. For example `arduino:avr` for latest, `arduino:avr@1.8.1` for specific version
- *(Optional)* Set `Additional URLs for the board manager`

## lib update-index
Updates the libraries index to the latest version.
- *(Optional)* Set `Additional URLs for the board manager`

## lib install
Installs additionals cores.
- Set `lib name` to install lib. For example `AudioZero` for latest verion, `AudioZero@1.0.0` for specific verion
- *(Optional)* Set `Additional URLs for the board manager`

## build
Builds binary from Arduino sketch.
- Set `Fully Qualified Board Name` to board name, e.g.: `arduino:avr:uno` 
- Set `Path to sketch`to directory path to the sketch to compile, e.g.: `$(System.DefaultWorkingDirectory)/Path/To/Sketch`
- *(Optional)* Set `Path to arduino-cli` to custom directory where arduino-cli is located


# Changelog

## 1.0.1
- Fix crash on arm agents
    - Only support ARMv7, because Azure DevOps only supports ARMv7 agents. See https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-linux?view=azure-devops#check-prerequisites

## 1.0.0
- Added basic version for cli tasks install, core update-index, lib update-index, lib install, build