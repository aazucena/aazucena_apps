FROM node:22-alpine

# Install dependencies required for sharp and other native modules
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git

WORKDIR /srv/app

# Copy CMS package files directly to WORKDIR
COPY apps/cms/pnpm-lock.yaml ./
COPY apps/cms/package.json ./
COPY apps/cms/plugins.sh ./
COPY apps/cms/icons.sh ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies (standalone, with lockfile for deterministic builds)
RUN pnpm install --frozen-lockfile

# Update pnpm lockfile to the lastest version
RUN pnpm self-update

# Copy CMS application files
COPY apps/cms ./

# Set environment
ENV NODE_ENV=development

# Expose Strapi port
EXPOSE 1337

# Start Strapi in development mode
CMD ["pnpm", "develop"]
