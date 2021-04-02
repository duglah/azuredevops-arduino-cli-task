#!/bin/bash
# Build TS
yarn global add typescript

echo "Building Task: build"
cd ./tasks/build/buildV0
yarn install
tsc
cd ../buildV1
yarn install
tsc

echo "Building Task: install"
cd ../../install/installV0
yarn install
tsc
cd ../installV1
yarn install
tsc

echo "Building Task: core_install"
cd ../../core_install/core_installV0
yarn install
tsc
cd ../core_installV1
yarn install
tsc

echo "Building Task: core_update_index"
cd ../../core_update_index/core_update_indexV0
yarn install
tsc
cd ../core_update_indexV1
yarn install
tsc

echo "Building Task: lib_install"
cd ../../lib_install/lib_installV0
yarn install
tsc
cd ../lib_installV1
yarn install
tsc

echo "Building Task: lib_update_index"
cd ../../lib_update_index/lib_update_indexV0
yarn install
tsc
cd ../lib_update_indexV1
yarn install
tsc

cd ../../../

echo "Creating extension..."
yarn global add tfx-cli
tfx extension create --manifest-globs vss-extension.json

# Upload to https://marketplace.visualstudio.com/manage/publishers/philippmanstein