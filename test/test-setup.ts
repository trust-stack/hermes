import { exec } from "child_process";
import * as dotenv from "dotenv";
import { Client } from "pg";
import { promisify } from "util";

dotenv.config({ path: ".env.test" });

const execAsync = promisify(exec);

async function waitForPostgres(retries = 5, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    const client = new Client({
      host: "localhost",
      port: 5432,
      user: "hermes",
      password: "password",
      database: "hermes",
    });
    try {
      await client.connect();
      console.log("PostgreSQL is ready!");
      await client.end();
      return;
    } catch (err) {
      console.log(`Waiting for PostgreSQL... (attempt ${i + 1}/${retries})`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error("Failed to connect to PostgreSQL after multiple attempts");
}

export async function setup() {
  // Start Docker containers
  await execAsync("pnpm run docker:up");

  // Wait for Postgres to be ready
  await waitForPostgres();

  // Apply Prisma schema
  await execAsync("pnpm run prisma:generate");
  await execAsync("pnpm run prisma:push", {
    env: {
      ...process.env,
      DATABASE_URL:
        "postgresql://hermes:password@localhost:5432/hermes?schema=public",
    },
  });
}

export async function teardown() {
  // Stop Docker containers
  await execAsync("pnpm run docker:down");
}
