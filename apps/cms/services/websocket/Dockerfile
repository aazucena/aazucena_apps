FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

# Copy source and config
COPY tsconfig.json ./
COPY src ./src
COPY monitors.json ./

# Build TypeScript
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]