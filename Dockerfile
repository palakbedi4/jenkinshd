# Base image explicitly for amd64 architecture
FROM --platform=linux/amd64 node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the port
EXPOSE 3000

# Default command
CMD ["npm", "start"]
