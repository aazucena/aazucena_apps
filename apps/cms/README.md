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
