import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { ExternalResolverSetDto } from "../src/external-resolver/external-resolver.dto";
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
    await prismaService.linkset.deleteMany();
  });

  it("/external-resolvers (POST)", () => {
    const dto: ExternalResolverSetDto = {
      pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
      resolvers: [
        {
          pattern: `^(N).*`,
          href: "https://nsw-pic.com",
        },
      ],
    };

    return request(app.getHttpServer())
      .post("/external-resolvers")
      .send(dto)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
            resolvers: expect.arrayContaining([
              expect.objectContaining({
                pattern: `^(N).*`,
                href: "https://nsw-pic.com",
              }),
            ]),
          }),
        );
      });
  });

  it("/external-resolvers (PUT)", () => {
    const dto: ExternalResolverSetDto = {
      pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
      resolvers: [
        {
          pattern: `^(N).*`,
          href: "https://nsw-pic.com",
        },
      ],
    };

    return request(app.getHttpServer())
      .put("/external-resolvers")
      .send(dto)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
            resolvers: expect.arrayContaining([
              expect.objectContaining({
                pattern: `^(N).*`,
                href: "https://nsw-pic.com",
              }),
            ]),
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
    const dto: ExternalResolverSetDto = {
      pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
      resolvers: [
        // New South Wales
        {
          pattern: `^(N).*`,
          href: "https://nsw-pic.com",
        },
        // South Australia
        {
          pattern: `^(S).*`,
          href: "https://sa-pic.com",
        },
      ],
    };

    // Create external resolver set.
    await request(app.getHttpServer())
      .post("/external-resolvers")
      .send(dto)
      .expect(201)
      .then((response) => {
        id = response.body["id"];
        expect(response.body).toEqual(
          expect.objectContaining({
            pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
            resolvers: expect.arrayContaining([
              expect.objectContaining({
                pattern: `^(N).*`,
                href: "https://nsw-pic.com",
              }),
              expect.objectContaining({
                pattern: `^(S).*`,
                href: "https://sa-pic.com",
              }),
            ]),
          }),
        );
      });

    await request(app.getHttpServer())
      .get(`/external-resolvers/${id}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id,
            pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
            resolvers: expect.arrayContaining([
              expect.objectContaining({
                pattern: `^(N).*`,
                href: "https://nsw-pic.com",
              }),
              expect.objectContaining({
                pattern: `^(S).*`,
                href: "https://sa-pic.com",
              }),
            ]),
          }),
        );
      });

    // Resolve NSW PIC
    await request(app.getHttpServer())
      .get("/NSW123456")
      .expect(302)
      .expect("Location", "https://nsw-pic.com/NSW123456");

    // Resolve SA PIC
    await request(app.getHttpServer())
      .get("/SA123456")
      .expect(302)
      .expect("Location", "https://sa-pic.com/SA123456");
  });
});
