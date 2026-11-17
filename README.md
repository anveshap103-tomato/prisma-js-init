# prisma-js-init

A simple CLI tool to quickly set up **Prisma 7 with PostgreSQL and CommonJS** in your Node.js project.

## Installation & Usage

Run this command inside your Node.js project:

```bash
npx prisma-js-init
```

That's it! The CLI automatically:

- Initializes npm if `package.json` doesn't exist.
- Installs Prisma 7, Prisma Client, PostgreSQL adapter, `pg`, and `dotenv`.
- Configures your project to use CommonJS.
- Initializes Prisma.
- Configures Prisma for CommonJS.
- Creates `config/config.js` with the Prisma Client setup.
- Generates Prisma Client.

## Requirements

- Node.js
- npm
- PostgreSQL

## After Setup

Add your database connection string to the `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME"
```

Make sure your PostgreSQL database exists before connecting.
