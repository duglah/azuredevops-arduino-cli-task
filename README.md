# arduino-cli for Azure DevOps
Inofficial community implementation of [arduino-cli](https://arduino.github.io/arduino-cli/) task for [Azure DevOps](https://azure.microsoft.com/de-de/services/devops/).

## Installation
Install via [Visual Studio MarketPlace](https://marketplace.visualstudio.com/items?itemName=PhilippManstein.arduino-cli).

## Usage
Description  of tasks.

### install
Installs arduino-cli to agent, when not installed already.
- Set specific `version`, for example `0.9.0` or as `latest`to install arduino-cli

### core update-index
Updates the index of cores.
- *(Optional)* Set `Additional URLs for the board manager`

### core install
Installs additionals cores.
- Set `core name` to install core. For example `arduino:avr` for latest, `arduino:avr@1.8.1` for specific version
- *(Optional)* Set `Additional URLs for the board manager`

### lib update-index
Updates the libraries index to the latest version.
- *(Optional)* Set `Additional URLs for the board manager`

### lib install
Installs additionals cores.
- Set `lib name` to install lib. For example `AudioZero` for latest verion, `AudioZero@1.0.0` for specific verion
- *(Optional)* Set `Additional URLs for the board manager`

### build
Builds binary from Arduino sketch.
- Set `Fully Qualified Board Name` to board name, e.g.: `arduino:avr:uno` 
- Set `Path to sketch`to directory path to the sketch to compile, e.g.: `$(System.DefaultWorkingDirectory)/Path/To/Sketch`
- *(Optional)* Set `Path to arduino-cli` to custom directory where arduino-cli is located