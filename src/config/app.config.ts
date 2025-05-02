import {registerAs} from "@nestjs/config";

export interface AppConfig {
  DATABASE_URL: string;
  RESOLVER_ROOT?: string;
  RESOLVER_NAME?: string;
}

export const appConfig = registerAs(
  "app",
  (): AppConfig => ({
    DATABASE_URL: process.env.DATABASE_URL,
    RESOLVER_ROOT: process.env.TRUST_STACK_RESOLVER_ROOT || "",
    RESOLVER_NAME:
      process.env.TRUST_STACK_RESOLVER_NAME || "Trust Stack Link Resolver",
  })
);
