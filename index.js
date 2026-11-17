#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const cwd = process.cwd();

function run(command) {
  execSync(command, { cwd, stdio: "inherit" });
}

// Initialize npm if package.json doesn't exist
if (!fs.existsSync(path.join(cwd, "package.json"))) {
  run("npm init -y");
}

// Install dependencies
run("npm install prisma@7 --save-dev");
run("npm install @prisma/client@7 @prisma/adapter-pg pg dotenv");

// Set CommonJS
const packagePath = path.join(cwd, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
packageJson.type = "commonjs";
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

// Initialize Prisma
run("npx prisma init");

// Convert Prisma config to CommonJS
const configPath = path.join(cwd, "prisma7.config.ts");
if (fs.existsSync(configPath)) {
  let config = fs.readFileSync(configPath, "utf8");

  config = config
    .replace('import "dotenv/config";', 'require("dotenv").config();')
    .replace('import { defineConfig } from "prisma/config";',
      'const { defineConfig } = require("prisma/config");')
    .replace("export default defineConfig", "module.exports = defineConfig");

  fs.writeFileSync(
    path.join(cwd, "prisma7.config.js"),
    config
  );
  fs.unlinkSync(configPath);
}

// Update Prisma schema
const schemaPath = path.join(cwd, "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf8");

schema = schema
  .replace(/output\s*=\s*["'][^"']+["']\s*/g, "")
  .replace(/provider\s*=\s*["']prisma-client["']/,
    'provider = "prisma-client-js"');

fs.writeFileSync(schemaPath, schema);

// Create Prisma client configuration
const configDir = path.join(cwd, "config");
fs.mkdirSync(configDir, { recursive: true });

fs.writeFileSync(
  path.join(configDir, "config.js"),
  `const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const pg = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

const Prisma = new PrismaClient({
  adapter: pg
});

module.exports = { Prisma };
`
);

// Generate Prisma Client
run("npx prisma generate");

console.log("\nPrisma 7 CommonJS setup completed!");
