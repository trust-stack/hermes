import { registerAs } from "@nestjs/config";

export interface AppConfig {
  databaseUrl: string;
  resolverRoot?: string;
  resolverName?: string;
}

export const appConfig = registerAs(
  "app",
  (): AppConfig => ({
    databaseUrl: process.env.DATABASE_URL,
    resolverRoot: process.env.RESOLVER_ROOT || "",
    resolverName: process.env.RESOLVER_NAME || "Trust Stack Link Resolver",
  }),
);
