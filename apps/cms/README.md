# 🚀 Getting started with Strapi

This Strapi CMS is configured to run with Docker Compose using PostgreSQL 16 + pgVector extension.

## Prerequisites

- Docker Compose v2.40.3+
- pnpm v10.21.0+

## Quick Start (Docker Compose - Recommended)

### 1. Start Docker Services

From the project root directory (`aazucena_apps/`):

```bash
docker compose up -d
```

This will:
- Build the Strapi container
- Start PostgreSQL 16 with pgVector extension
- Create a persistent volume for database data
- Expose Strapi on `http://localhost:1337`
- Expose PostgreSQL on `localhost:5432`

### 2. View Logs

```bash
# View all logs
docker compose logs -f

# View Strapi logs only
docker compose logs -f strapi

# View PostgreSQL logs only
docker compose logs -f postgres
```

### 3. Access Strapi Admin Panel

**URL:** http://localhost:1337/admin

On first access, you'll be prompted to create a super admin account.

### 4. Stop Containers

```bash
docker compose down
```

### 5. Rebuild After Changes

```bash
docker compose up -d --build
```

## 🔌 Plugin Installation

Strapi CMS uses a collection of plugins to enhance functionality. The `plugins.sh` script automates the installation of all required plugins.

### Available Plugins

This installation includes 10 plugins:

1. **@strapi/provider-upload-cloudinary** - Cloud media storage provider for uploading images and files to Cloudinary
2. **@strapi/plugin-graphql** - Adds GraphQL API endpoint alongside the REST API for flexible data querying
3. **@strapi/plugin-documentation** - Auto-generates OpenAPI/Swagger documentation for your API endpoints
4. **@strapi/plugin-sentry** - Error tracking and monitoring integration with Sentry for production debugging
5. **strapi-plugin-preview-button** - Adds preview functionality to content types for viewing draft content before publishing
6. **@strapi/plugin-seo** - SEO metadata management with meta tags, social sharing, and structured data support
7. **@_sh/strapi-plugin-ckeditor** - Advanced WYSIWYG editor (CKEditor 5) for rich text content editing
8. **strapi-plugin-multi-select** - Adds multi-select field type for selecting multiple options from a list
9. **strapi-advanced-uuid** - UUID field type with advanced configuration options for unique identifiers
10. **@strapi/plugin-color-picker** - Color picker field type for managing color values in content types

### How to Use plugins.sh

**From the `apps/cms/` directory:**

```bash
# Make the script executable (first time only)
chmod +x plugins.sh

# Run the installation script
./plugins.sh
```

**What the script does:**

1. **Installs all plugins** - Adds all 10 plugins to the Strapi project using pnpm
2. **Resolves dependencies** - Runs `pnpm i --ignore-workspace` to ensure all dependencies are properly installed
3. **Rebuilds Docker containers** - Rebuilds the Docker image with `--no-cache` to include the new plugins

### Why `pnpm i --ignore-workspace`?

The `--ignore-workspace` flag tells pnpm to install dependencies in the current package (`apps/cms`) without considering the monorepo workspace configuration. This is necessary because:

- Strapi plugins expect to be installed directly in the Strapi project
- Workspace hoisting can cause module resolution issues for Strapi plugins
- It ensures plugins are available in the correct `node_modules` directory

### Why `docker compose build --no-cache`?

The `--no-cache` flag forces Docker to rebuild the image from scratch without using cached layers. This is critical after plugin installation because:

- **Ensures fresh dependencies** - New plugins and their dependencies are properly included in the Docker image
- **Prevents stale builds** - Cached layers might contain old dependency snapshots
- **Guarantees consistency** - The rebuilt image exactly matches your local `package.json` and `pnpm-lock.yaml`
- **Avoids runtime errors** - Prevents "module not found" errors when starting the container

### Important Notes

- **Strapi v5 Compatibility**: All plugins listed are compatible with Strapi v5. However, some community plugins may lag behind official releases. Always check plugin documentation for the latest compatibility information.

- **Plugin Configuration**: After installation, most plugins require configuration in `config/plugins.ts` or through the Strapi admin panel. Refer to each plugin's documentation for setup instructions.

- **Development vs Production**: Some plugins (like Sentry) require different configurations for development and production environments. Use environment variables in `config/plugins.ts` to manage this.

- **Container Restart Required**: After running `plugins.sh`, you must restart the Docker containers for changes to take effect:
  ```bash
  docker compose down
  docker compose up -d
  ```

- **Manual Installation Alternative**: If you prefer installing plugins individually, you can run:
  ```bash
  pnpm add <plugin-name>
  pnpm i --ignore-workspace
  docker compose build --no-cache
  docker compose up -d
  ```

### Plugin Documentation Links

- [Cloudinary Upload Provider](https://market.strapi.io/providers/@strapi-provider-upload-cloudinary)
- [GraphQL Plugin](https://docs.strapi.io/dev-docs/plugins/graphql)
- [Documentation Plugin](https://docs.strapi.io/dev-docs/plugins/documentation)
- [Sentry Plugin](https://market.strapi.io/plugins/@strapi-plugin-sentry)
- [Preview Button](https://market.strapi.io/plugins/strapi-plugin-preview-button)
- [SEO Plugin](https://market.strapi.io/plugins/@strapi-plugin-seo)
- [CKEditor Plugin](https://market.strapi.io/plugins/strapi-plugin-ckeditor)
- [Multi-Select Plugin](https://market.strapi.io/plugins/strapi-plugin-multi-select)
- [Advanced UUID](https://market.strapi.io/plugins/strapi-advanced-uuid)
- [Color Picker](https://market.strapi.io/plugins/@strapi-plugin-color-picker)

## Local Development (Without Docker)

If you prefer running Strapi locally without Docker:

### `develop`

Start your Strapi application with autoReload enabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```bash
pnpm develop
```

### `start`

Start your Strapi application with autoReload disabled. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-start)

```bash
pnpm start
```

### `build`

Build your admin panel. [Learn more](https://docs.strapi.io/dev-docs/cli#strapi-build)

```bash
pnpm build
```

**Note:** Local development requires PostgreSQL 16+ with pgVector extension installed on your system.

## ⚙️ Deployment

Strapi gives you many possible deployment options for your project including [Strapi Cloud](https://cloud.strapi.io). Browse the [deployment section of the documentation](https://docs.strapi.io/dev-docs/deployment) to find the best solution for your use case.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
