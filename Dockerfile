# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of your app
COPY . .

# Build the app
RUN npm run build

# Expose the default port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
