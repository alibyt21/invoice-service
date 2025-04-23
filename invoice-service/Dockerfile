# Use the official Node.js 20 image as base
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package files to install dependencies first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the NestJS project
RUN npm run build

# Expose the port that the NestJS app listens on
EXPOSE 3000

# Run the built application
CMD ["node", "dist/main"]

