# Use lightweight Alpine Node.js image.
FROM node:22-alpine

# Install build tools and libraries for native Node.js module compilation (e.g., sharp).
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    vips-dev \
    git

# Declare build-time argument for Node.js environment.
ARG NODE_ENV=development
# Set Node.js environment variable for app configuration.
ENV NODE_ENV=${NODE_ENV}

# Increase Node.js memory limit for memory-intensive tasks.
ENV NODE_OPTIONS=--max_old_space_size=4096

# Install pnpm globally and node-gyp as root.
RUN npm install -g pnpm node-gyp

# Set application working directory and ensure ownership for the node user.
WORKDIR /srv/app
RUN chown node:node /srv/app

# Switch to non-root user early.
USER node

# Copy essential package files with correct ownership.
COPY --chown=node:node pnpm-lock.yaml package.json ./

# Configure pnpm and install dependencies as the node user.
RUN pnpm config --global set fetch-retry-maxtimeout 600000 && pnpm install --frozen-lockfile

# Update pnpm executable to latest version.
RUN pnpm self-update

ENV PATH=/srv/app/node_modules/.bin:$PATH

# Copy application files with correct ownership.
COPY --chown=node:node . .

# Build Strapi admin panel in production mode for optimization.
RUN ["pnpm", "build"]

# Expose Strapi default port.
EXPOSE 1337

# Start Strapi in development mode.
CMD ["pnpm", "develop"]
