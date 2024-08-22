import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { UpsertExternalResolverDto } from "../src/external-resolver/external-resolver.dto";
import { PrismaService } from "../src/prisma/prisma.service";

describe("ExternalResolverController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.externalResolver.deleteMany();
  });

  it("/external-resolvers (POST)", () => {
    const dto: UpsertExternalResolverDto = {
      pattern: `^(N).*`,
      qualifier: "PIC",
      href: "https://nsw-pic.com",
    };

    return request(app.getHttpServer())
      .post("/external-resolvers")
      .send(dto)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            pattern: `^(N).*`,
            qualifier: "PIC",
            href: "https://nsw-pic.com",
          }),
        );
      });
  });

  it("/external-resolvers (PUT)", () => {
    const dto: UpsertExternalResolverDto = {
      pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
      qualifier: "PIC",
      href: "https://iscc.com",
    };

    return request(app.getHttpServer())
      .put("/external-resolvers")
      .send(dto)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
            qualifier: "PIC",
            href: "https://iscc.com",
          }),
        );
      });
  });

  /**
   * Test Case: Create and resolve an external resolver set
   *
   * This test case performs the following steps:
   * 1. Sends a POST request to create a new external resolver set
   *    - Includes a AUS PIC pattern
   *    - Includes a NSW PIC pattern
   *    - Includes a SA PIC pattern
   * 2. Fetch external resolver set via GET request
   * 3. Sends a GET request of a identifier that matches a NSW PIC
   * 4. Verifies a redirect is returned.
   * 5. Sends a GET request of a identifier that matches a SA PIC
   * 6. Verifies a redirect is returned.
   */
  it("should create, get, and resolve an external resolver set.", async () => {
    let id: string;
    const nswResolver: UpsertExternalResolverDto = {
      qualifier: "PIC",
      pattern: `^(N).*`,
      href: "https://nsw-pic.com",
    };

    // Create external resolver set.
    await request(app.getHttpServer())
      .post("/external-resolvers")
      .send(nswResolver)
      .expect(201)
      .then((response) => {
        id = response.body["id"];
        expect(response.body).toEqual(
          expect.objectContaining({
            qualifier: "PIC",
            pattern: `^(N).*`,
            href: "https://nsw-pic.com",
          }),
        );
      });

    const saResolver: UpsertExternalResolverDto = {
      qualifier: "PIC",
      pattern: `^(S).*`,
      href: "https://sa-pic.com",
    };

    // Create external resolver set.
    await request(app.getHttpServer())
      .post("/external-resolvers")
      .send(saResolver)
      .expect(201)
      .then((response) => {
        id = response.body["id"];
        expect(response.body).toEqual(
          expect.objectContaining({
            qualifier: "PIC",
            pattern: `^(S).*`,
            href: "https://sa-pic.com",
          }),
        );
      });

    // Resolve NSW PIC
    await request(app.getHttpServer())
      .get("/PIC/NSW123456")
      .expect(302)
      .expect("Location", "https://nsw-pic.com/PIC/NSW123456");

    // Resolve SA PIC
    await request(app.getHttpServer())
      .get("/PIC/SA123456")
      .expect(302)
      .expect("Location", "https://sa-pic.com/PIC/SA123456");
  });
});
