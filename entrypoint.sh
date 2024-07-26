#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Variables
GITHUB_URL=$GITHUB_URL
INSTALL_COMMAND=$INSTALL_COMMAND
BUILD_COMMAND=$BUILD_COMMAND
OUTPUT_FOLDER=$OUTPUT_FOLDER
DEPLOY_KEY=$DEPLOY_KEY
ANT_PROCESS_ID=$ANT_PROCESS_ID

# Clone the repository
git clone $GITHUB_URL repo
cd repo

# Run the install command
eval $INSTALL_COMMAND

# Run the build command
eval "$BUILD_COMMAND && permaweb-deploy --ant-process $ANT_PROCESS_ID"

# Store the index.html in the specified output folder
mkdir -p /usr/src/app/$OUTPUT_FOLDER
cp index.html /usr/src/app/$OUTPUT_FOLDER/

# Print success message
echo "Build successful"

# Exit the script successfully
exit 0
