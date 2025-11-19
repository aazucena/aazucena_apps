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
  @strapi-community/plugin-rest-cache \
  @strapi-community/plugin-redis \
  @strapi-community/provider-rest-cache-redis
  # strapi-plugin-navigation \
  # @strapi/plugin-i18n \
  # strapi-plugin-sitemap

pnpm i --ignore-workspace
docker compose build --no-cache
