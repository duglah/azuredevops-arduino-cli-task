# arduino-cli for Azure DevOps
Inofficial community implementation of [arduino-cli](https://arduino.github.io/arduino-cli/) task for [Azure DevOps](https://azure.microsoft.com/de-de/services/devops/).

# Installation
Install via [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=PhilippManstein.arduino-cli).

# Usage
Example usage for Azure DevOps and detailed description of tasks and arguments.

# Tasks

## install: ArduinoCliInstall@1
Installs arduino-cli to agent, when not installed already.
- `version` (string): Set specific version, for example `0.18.0` or as `latest` to install arduino-cli. It isn't recommendet to use `latest` since arduino-cli has often breaking changes!

Example:
```yaml
- task: ArduinoCliInstall@1
  inputs:
    version: 'latest'
```

## core update-index: ArduinoCliCoreUpdateIndex@1
Updates the index of cores.
- *(Optional)* `additionalUrls` (string): Comma-separated list of additional URLs for the Boards Manager.
- *(Optional)* `configFile` (file path): The custom config file (if not specified the default will be used).
- *(Optional)* `format` (string): The output format, can be {text|json}.
- *(Optional)* `logFile` (file path): Path to the file where logs will be written.
- *(Optional)* `logFormat` (string): The output format for the logs.
- *(Optional)* `logLevel` (string): Messages with this level and above will be logged.
- *(Optional)* `verbose` (boolean): Print the logs on the standard output.
- *(Optional)* `ArdunioCliToolPath` (file path): Path to the arduino-cli if not using arduino-cli install task before this one.

Example:
```yaml
- task: ArduinoCliCoreUpdateIndex@1
```

## core install: ArduinoCliCoreInstall@1
Installs additionals cores.
- `core` (string): Name of core. `arduino:avr` for latest verion, `arduino:avr@1.8.1` for specific verion.
- *(Optional)* `runPostInstall` (boolean): Force run of post-install scripts (if the CLI is not running interactively).
- *(Optional)* `skipPostInstall` (boolean): Force skip of post-install scripts (if the CLI is running interactively).
- *(Optional)* `additionalUrls` (string): Comma-separated list of additional URLs for the Boards Manager.
- *(Optional)* `configFile` (file path): The custom config file (if not specified the default will be used).
- *(Optional)* `format` (string): The output format, can be {text|json}.
- *(Optional)* `logFile` (file path): Path to the file where logs will be written.
- *(Optional)* `logFormat` (string): The output format for the logs.
- *(Optional)* `logLevel` (string): Messages with this level and above will be logged.
- *(Optional)* `verbose` (boolean): Print the logs on the standard output.
- *(Optional)* `ArdunioCliToolPath` (file path): Path to the arduino-cli if not using arduino-cli install task before this one.

Example:
```yaml
- task: ArduinoCliCoreInstall@1
  inputs:
    core: 'arduino:avr'
```

## lib update-index: ArduinoCliLibdateIndex@1
Updates the libraries index to the latest version.
- *(Optional)* `additionalUrls` (string): Comma-separated list of additional URLs for the Boards Manager.
- *(Optional)* `configFile` (file path): The custom config file (if not specified the default will be used).
- *(Optional)* `format` (string): The output format, can be {text|json}.
- *(Optional)* `logFile` (file path): Path to the file where logs will be written.
- *(Optional)* `logFormat` (string): The output format for the logs.
- *(Optional)* `logLevel` (string): Messages with this level and above will be logged.
- *(Optional)* `verbose` (boolean): Print the logs on the standard output.
- *(Optional)* `ArdunioCliToolPath` (file path): Path to the arduino-cli if not using arduino-cli install task before this one.

Example:
```yaml
- task: ArduinoCliCoreUpdateIndex@1
```

## lib install: ArduinoCliLibInstall@1
Installs additionals cores.
- `installLibBy` (string): Specify how to install a library. You can choose by name `libName`, git url `gitUrl` or zip path `zipPath`.
- `lib` (string): Name of lib. `AudioZero` for latest verion, `AudioZero@1.0.0` for specific verion. Can only be used, when `installLibBy` is `libName`.
- `gitUrl` (string): Enter git url for libraries hosted on repositories. Can only be used, when `installLibBy` is `gitUrl`.
- `zipPath` (filePath): Enter a path to zip file. Can only be used, when `installLibBy` is `zipPath`.
- *(Optional)* `additionalUrls` (string): Comma-separated list of additional URLs for the Boards Manager.
- *(Optional)* `configFile` (file path): The custom config file (if not specified the default will be used).
- *(Optional)* `format` (string): The output format, can be {text|json}.
- *(Optional)* `logFile` (file path): Path to the file where logs will be written.
- *(Optional)* `logFormat` (string): The output format for the logs.
- *(Optional)* `logLevel` (string): Messages with this level and above will be logged.
- *(Optional)* `verbose` (boolean): Print the logs on the standard output.
- *(Optional)* `ArdunioCliToolPath` (file path): Path to the arduino-cli if not using arduino-cli install task before this one.

Example:
```yaml
- task: ArduinoCliLibInstall@1
  inputs:
    installLibBy: 'libName'
    lib: 'OneWire@2.3.5'
```

## build: ArduinoCliBuild@1
Builds binary from Arduino sketch.
- `fqbn` (string): Fully Qualified Board Name, e.g.: `arduino:avr:uno`.
- `sketchDir` (file path): Path to sketch directory. For example: `$(System.DefaultWorkingDirectory)/MySketch`, when a sketch is located in `$(System.DefaultWorkingDirectory)/MySketch/MySketch.ino`.
- *(Optional)* `outputDir` (file path): Save build artifacts in this directory. Supported by arduino-cli 0.11.0 and newer.
- *(Optional)* `buildCachePath` (file path): CBuilds of 'core.a' are saved into this path to be cached and reused.
- *(Optional)* `buildPath` (file path): CPath where to save compiled files. If omitted, a directory will be created in the default temporary path of your OS
- *(Optional)* `buildProperty` (string): Override a build property with a custom value. Can be used multiple times for multiple properties.
- *(Optional)* `clean` (boolean): Optional, cleanup the build folder and do not use any cached build.
- *(Optional)* `exportBinaries` (boolean): If set built binaries will be exported to the sketch folder.
- *(Optional)* `libraries` (string): List of custom libraries paths separated by commas.
- *(Optional)* `onlyCompilationDatabase` (boolean): Just produce the compilation database, without actually compiling.
- *(Optional)* `optimizeForDebug` (boolean): Optional, optimize compile output for debugging, rather than for release.
- *(Optional)* `vidPid` (string): When specified, VID/PID specific build properties are used, if board supports them.
- *(Optional)* `warnings` (string): Optional, can be `none`, `default`, `more` and `all`. Defaults to `none`. Used to tell gcc which warning level to use (-W flag). (default `none`).
- *(Optional)* `additionalUrls` (string): Comma-separated list of additional URLs for the Boards Manager.
- *(Optional)* `configFile` (file path): The custom config file (if not specified the default will be used).
- *(Optional)* `format` (string): The output format, can be {text|json}.
- *(Optional)* `logFile` (file path): Path to the file where logs will be written.
- *(Optional)* `logFormat` (string): The output format for the logs.
- *(Optional)* `logLevel` (string): Messages with this level and above will be logged.
- *(Optional)* `verbose` (boolean): Print the logs on the standard output.
- *(Optional)* `ArdunioCliToolPath` (file path): Path to the arduino-cli if not using arduino-cli install task before this one.

Example:
```yaml
- task: ArduinoCliBuild@1
  inputs:
    fqbn: 'arduino:avr:uno'
    sketchDir: '$(System.DefaultWorkingDirectory)/Main'
```

## Example azure-pipelines.yml

[![Build Status](https://dev.azure.com/pmanstein/azuredevops-arduino-cli-task/_apis/build/status/duglah.azuredevops-arduino-cli-task?branchName=main)](https://dev.azure.com/pmanstein/azuredevops-arduino-cli-task/_build/latest?definitionId=7&branchName=main)

Basic example script for building [Blink example](Main/Main.ino) on Azure DevOps for Arduino Uno. 
See [azure-pipelines.yml](azure-pipelines.yml):
```yaml
# Sample azure cli to build and publish Arduino Blink example for the Arduino Uno board
trigger:
  - main
  
pool:
  vmImage: 'ubuntu-latest'

steps:
# Install latest version of arduino cli
# Not recommended to use the version 'latest'!!!
# arduino-cli has often breaking changes!
# Check https://github.com/arduino/arduino-cli/issues if something is not working anymore!
# So set a specific version! Like: 0.18.0
- task: ArduinoCliInstall@1
  inputs:
    version: 'latest'

# "The first thing to do upon a fresh install is to update the local cache of available platforms and libraries by running"
# see "Getting started" https://arduino.github.io/arduino-cli/getting-started/#connect-the-board-to-your-pc
- task: ArduinoCliCoreUpdateIndex@1

# Install core for 'arduino:avr'
- task: ArduinoCliCoreInstall@1
  inputs:
    core: 'arduino:avr'

# Build Main/Main.ino for fqbn 'arduino:avr:uno'
# Like every arduino project, the sketch file must be in a directory named the same as the sketch... ¯\_(ツ)_/¯
# Since arudino cli version 0.10.0 you can't specify a custom path to a sketch file, like 'somedir/someskecht.ino'!
- task: ArduinoCliBuild@1
  inputs:
    fqbn: 'arduino:avr:uno'
    sketchDir: '$(System.DefaultWorkingDirectory)/Main'
    outputDir: '$(Build.ArtifactStagingDirectory)'


# Publish build artifacts
- task: PublishBuildArtifacts@1
  inputs:
    PathtoPublish: '$(Build.ArtifactStagingDirectory)'
    ArtifactName: 'ArduinoUno-Blink'
    publishLocation: 'Container'
```

1. Pipeline triggers on commit on `main` on `ubuntu-latest``
2. Installs latest arduino-cli with task `ArduinoCliInstall@1`
3. "The first thing to do upon a fresh install is to update the local cache of available platforms and libraries by running" [Getting started](https://arduino.github.io/arduino-cli/getting-started/#connect-the-board-to-your-pc), so run task `ArduinoCliCoreUpdateIndex@1`
4. Install core for `arduino:avr` in task `ArduinoCliCoreInstall@1`
5. Build [Main/Main.ino](Main/Main.ino) for Arudino Uno with task `ArduinoCliBuild@1`

# Changelog

## 1.1.0
- Add more build options to support arduino-cli 0.18.0

## 1.0.1
- Fix crash on arm agents
    - Only support ARMv7, because Azure DevOps only supports ARMv7 agents. See https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/v2-linux?view=azure-devops#check-prerequisites

## 1.0.0
- Added basic version for cli tasks install, core update-index, lib update-index, lib install, build