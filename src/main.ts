import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import { AppModule } from "./app.module";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Hermes Link Resolver")
    .setDescription("Hermes API documentation")
    .setVersion("1.0")
    .addTag("link-resolver")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, document);

  if (process.env.NODE_ENV === "development") app.enableCors();

  await app.listen(3000);
}

bootstrap();
