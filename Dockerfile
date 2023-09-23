# Use an official Node.js runtime as the base image
FROM node:14

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source code into the container
COPY . .

# Expose port 5000 for the Node.js application
EXPOSE 5000

# Define the command to start your Node.js application
CMD ["npm", "start"]
