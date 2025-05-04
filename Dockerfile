FROM node:16

WORKDIR /app

# Copy package.json files first for better caching
COPY package.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install dependencies
RUN npm install
RUN cd client && npm install
RUN cd server && npm install

# Copy the rest of the code
COPY . .

# Build the client
RUN cd client && npm run build

# Start the server
CMD ["npm", "start"]
