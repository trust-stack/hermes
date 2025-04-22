import { Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";
import { appConfig } from "./app.config";
import { validateConfig } from "./config.validation";

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateConfig,
      load: [appConfig],
    }),
  ],
})
export class ConfigModule {}
