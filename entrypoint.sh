#!/bin/bash

set -e

GITHUB_URL=$GITHUB_URL
INSTALL_COMMAND=$INSTALL_COMMAND
BUILD_COMMAND=$BUILD_COMMAND
OUTPUT_FOLDER=$OUTPUT_FOLDER

git clone $GITHUB_URL repo
cd repo

eval $INSTALL_COMMAND

eval $BUILD_COMMAND

mkdir -p /usr/src/app/$OUTPUT_FOLDER
cp index.html /usr/src/app/$OUTPUT_FOLDER/

echo "Build successful"

exit 0
