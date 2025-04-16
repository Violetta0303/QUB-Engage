# Use the official Node.js image as the base image
FROM node:20

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .
COPY .env ./

# Expose the port that the Express.js app will listen on
EXPOSE 3000

# Define the command to start the Express.js app
CMD ["node", "src/monitor.js"]
