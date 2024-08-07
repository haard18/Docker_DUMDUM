# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the script to the container
COPY entrypoint.sh /usr/src/app/entrypoint.sh

# Give execute permission to the script
RUN chmod +x /usr/src/app/entrypoint.sh

# Install Git
RUN apt-get update && apt-get install -y git
# Install Irys SDK
RUN npm install @irys/sdk

# Run the entrypoint script
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
