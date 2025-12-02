#!/bin/bash

# Load variables from .env
set -a
[ -f .env ] && source .env
set +a

pnpm add @strapi/provider-upload-cloudinary \
  @strapi/plugin-graphql \
  @strapi/plugin-documentation \
  @strapi/plugin-sentry \
  strapi-plugin-preview-button \
  @strapi/plugin-seo \
  @_sh/strapi-plugin-ckeditor \
  strapi-plugin-multi-select \
  strapi-advanced-uuid \
  @strapi/plugin-color-picker \
  strapi-plugin-preview-button \
  strapi-plugin-navigation \
  strapi-plugin-duplicate-button \
  strapi-plugin-config-sync \
  strapi-plugin-publisher \
  strapi-plugin-icons-field \
  @strapi-community/plugin-rest-cache \
  @strapi-community/plugin-redis \
  @strapi-community/provider-rest-cache-redis

if [ -f "icons.sh" ]; then
  chmod +x ./icons.sh && source ./icons.sh
fi

pnpm i --ignore-workspace

NODE_OPTIONS=--max_old_space_size=4096 pnpm build
