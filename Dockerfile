# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy bot source code
COPY . .

# Set environment variables
ENV NODE_ENV=production

# Start the bot
CMD ["npm", "start"]