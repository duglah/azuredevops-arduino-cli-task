# arduino-cli for Azure DevOps
Inofficial community implementation of [arduino-cli](https://arduino.github.io/arduino-cli/) task for [Azure DevOps](https://azure.microsoft.com/de-de/services/devops/).

# Installation
Install via [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=PhilippManstein.arduino-cli).

# Usage
Example usage for Azure DevOps and detailed description of tasks and arguments.

# Tasks

## install: ArduinoCliInstall@1
Installs arduino-cli to agent, when not installed already.
- Set specific `version`, for example `0.9.0` or as `latest`to install arduino-cli

Example:
```yaml
- task: ArduinoCliInstall@0
  inputs:
    version: 'latest'
```

## core update-index: ArduinoCliCoreUpdateIndex@0
Updates the index of cores.
- *(Optional)* Set `Additional URLs for the board manager`

Example:
```yaml
- task: ArduinoCliCoreUpdateIndex@0
```

## core install: ArduinoCliCoreInstall@0
Installs additionals cores.
- Set `core name` to install core. For example `arduino:avr` for latest, `arduino:avr@1.8.1` for specific version
- *(Optional)* Set `Additional URLs for the board manager`

Example:
```yaml
- task: ArduinoCliCoreInstall@0
  inputs:
    core: 'arduino:avr'
```

## lib update-index: ArduinoCliLibdateIndex@0
Updates the libraries index to the latest version.
- *(Optional)* Set `Additional URLs for the board manager`

Example:
```yaml
- task: ArduinoCliCoreUpdateIndex@0
```

## lib install: ArduinoCliLibInstall@0
Installs additionals cores.
- Set `lib name` to install lib. For example `AudioZero` for latest verion, `AudioZero@1.0.0` for specific verion
- *(Optional)* Set `Additional URLs for the board manager`

Example:
```yaml
- task: ArduinoCliLibInstall@0
  inputs:
    lib: 'OneWire@2.3.5'
```

## build: ArduinoCliBuild@0
Builds binary from Arduino sketch.
- Set `Fully Qualified Board Name` to board name, e.g.: `arduino:avr:uno` 
- Set `Path to sketch`to directory path to the sketch to compile, e.g.: `$(System.DefaultWorkingDirectory)/Path/To/Sketch`
- *(Optional)* Set `Path to arduino-cli` to custom directory where arduino-cli is located

Example:
```yaml
- task: ArduinoCliBuild@0
  inputs:
    fqbn: 'arduino:avr:uno'
    sketchDir: '$(System.DefaultWorkingDirectory)/Main'
```

## Example azure-pipelines.yml

[![Build Status](https://dev.azure.com/pmanstein/azuredevops-arduino-cli-task/_apis/build/status/duglah.azuredevops-arduino-cli-task?branchName=master)](https://dev.azure.com/pmanstein/azuredevops-arduino-cli-task/_build/latest?definitionId=7&branchName=master)

Basic example script for building [Blink example](Main/Main.ino) on Azure DevOps for Arduino Uno. 
See [azure-pipelines.yml](azure-pipelines.yml):
```yaml
# Sample azure cli to build and publish Arduino Blink example for the Arduino Uno board
trigger:
  - master
  
pool:
  vmImage: 'ubuntu-latest'

steps:
# Install latest version of arduino cli
# Not recommended to use the version 'latest'!!!
# arduino-cli has often breaking changes!
# Check https://github.com/arduino/arduino-cli/issues if something is not working anymore!
# So set a specific version! Like: 0.9.0
- task: ArduinoCliInstall@1
  inputs:
    version: 'latest'

# "The first thing to do upon a fresh install is to update the local cache of available platforms and libraries by running"
# see "Getting started" https://arduino.github.io/arduino-cli/getting-started/#connect-the-board-to-your-pc
- task: ArduinoCliCoreUpdateIndex@0

# Install core for 'arduino:avr'
- task: ArduinoCliCoreInstall@0
  inputs:
    core: 'arduino:avr'

# Build Main/Main.ino for fqbn 'arduino:avr:uno'
# Like every arduino project, the sketch file must be in a directory named the same as the sketch... ¯\_(ツ)_/¯
# Since arudino cli version 0.10.0 you can't specify a custom path to a sketch file, like 'somedir/someskecht.ino'!
- task: ArduinoCliBuild@0
  inputs:
    fqbn: 'arduino:avr:uno'
    sketchDir: '$(System.DefaultWorkingDirectory)/Main'


# Copy Main.ino.with_bootloader.bin file to the staging directory
# If you use a different fqbn the file ending may be different
# and the directory also,
# so check which files are generated locally
# Different versions of arduino-cli also generate different files!
- task: CopyFiles@2
  inputs:
    SourceFolder: '$(System.DefaultWorkingDirectory)/Main/build/arduino.avr.uno/'
    Contents: 'Main.ino.with_bootloader.bin'
    TargetFolder: '$(Build.ArtifactStagingDirectory)'

# Publish build artifacts
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'ArduinoUno-Blink'
    publishLocation: 'Container'
```

1. Pipeline triggers on commit on `master` on `ubuntu-latest``
2. Installs latest arduino-cli with task `ArduinoCliInstall@1`
3. "The first thing to do upon a fresh install is to update the local cache of available platforms and libraries by running" [Getting started](https://arduino.github.io/arduino-cli/getting-started/#connect-the-board-to-your-pc), so run task `ArduinoCliCoreUpdateIndex@0`
4. Install core for `arduino:avr` in task `ArduinoCliCoreInstall@0`
5. Build [Main/Main.ino](Main/Main.ino) for Arudino Uno with task `ArduinoCliBuild@0`

# Changelog

## 1.0.1
- Fix crash on arm agents
    - Only support ARMv7, because Azure DevOps only supports ARMv7 agents. See https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-linux?view=azure-devops#check-prerequisites

## 1.0.0
- Added basic version for cli tasks install, core update-index, lib update-index, lib install, build