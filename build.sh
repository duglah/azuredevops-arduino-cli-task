#!/bin/bash
# Build TS
yarn global add typescript

cd ./tasks/build
yarn install
tsc
cd ../install
yarn install
tsc
cd ../core_install
yarn install
tsc
cd ../core_update_index
yarn install
tsc
cd ../lib_install
yarn install
tsc
cd ../lib_update_index
yarn install
tsc

cd ../../

# Create extension
yarn global add tfx-cli
tfx extension create --manifest-globs vss-extension.json

# Upload to https://marketplace.visualstudio.com/manage/publishers/philippmanstein