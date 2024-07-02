import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

module.exports = async () => {
  // Start Docker containers
  await execAsync("pnpm run docker:up");

  // Apply Prisma schema
  await execAsync("pnpm run prisma:generate");
  await execAsync("pnpm run prisma:push", {
    env: {
      ...process.env,
      DATABASE_URL:
        "postgresql://hermes:password@localhost:5432/hermes?schema=public",
    },
  });
};
