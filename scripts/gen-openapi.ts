import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { writeFileSync } from "fs";
import * as path from "path";
import { AppModule } from "../src/app.module";

async function generateOpenapi() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle("link-resolver")
    .setDescription("link-resolver Link Resolver")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  const outputPath = path.resolve(process.cwd(), "openapi.json");

  writeFileSync(outputPath, JSON.stringify(document, null, 2), {
    encoding: "utf8",
  });

  await app.close();
}

generateOpenapi();
