import {INestApplication, ValidationPipe} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {PrismaClient} from "@prisma/client";
import request from "supertest";
import {AppModule} from "../src/app.module";
import {CreateLinkDto} from "../src/link";

describe("LinkController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = await moduleFixture.resolve<PrismaClient>("PRISMA_CLIENT");

    // Set up ValidationPipe with the same configuration as the main application
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: 400,
      })
    );

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.link.deleteMany();
  });

  describe("/links (POST)", () => {
    it("should create a link", () => {
      const dto: CreateLinkDto = {
        path: "/qualifier/identifier",
        type: "text/html",
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      };

      return request(app.getHttpServer())
        .post("/links")
        .send(dto)
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              path: "/qualifier/identifier",
              type: "text/html",
              href: "https://example.com",
              title: "Test Link",
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            })
          );
        });
    });

    it("should reject invalid link path", () => {
      const dto: CreateLinkDto = {
        path: "invalid/path/with//double/slash", // Invalid path with double slash
        type: "text/html",
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      };

      return request(app.getHttpServer())
        .post("/links")
        .send(dto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining(
                "Path must consist of valid qualifier/identifier pairs"
              ),
            ])
          );
        });
    });

    it("should reject path without qualifier/identifier", () => {
      const dto: CreateLinkDto = {
        path: "/invalid", // Missing qualifier/identifier pair
        type: "text/html",
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      };

      return request(app.getHttpServer())
        .post("/links")
        .send(dto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining(
                "Path must consist of valid qualifier/identifier pairs"
              ),
            ])
          );
        });
    });

    it("should reject invalid MIME type", () => {
      const dto: CreateLinkDto = {
        path: "/qualifier/identifier",
        type: "invalid-type", // Invalid MIME type format
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      };

      return request(app.getHttpServer())
        .post("/links")
        .send(dto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining("Type must be a valid MIME type format"),
            ])
          );
        });
    });

    it("should reject MIME type without subtype", () => {
      const dto: CreateLinkDto = {
        path: "/qualifier/identifier",
        type: "text", // Missing subtype
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      };

      return request(app.getHttpServer())
        .post("/links")
        .send(dto)
        .expect(400)
        .then((response) => {
          expect(response.body.message).toEqual(
            expect.arrayContaining([
              expect.stringContaining("Type must be a valid MIME type format"),
            ])
          );
        });
    });
  });

  it("/links/:id (GET)", async () => {
    // Arrange: Create a link
    const link = await prismaService.link.create({
      data: {
        path: "/qualifier/identifier",
        type: "text/html",
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      },
    });

    // Act & Assert: Get the link
    return request(app.getHttpServer())
      .get(`/links/${link.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: link.id,
            path: "/qualifier/identifier",
            type: "text/html",
            href: "https://example.com",
            title: "Test Link",
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          })
        );
      });
  });

  it("/links (GET)", async () => {
    // Arrange: Create multiple links
    await prismaService.link.createMany({
      data: [
        {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example1.com",
          title: "Test Link 1",
          default: true,
          relationType: "alternate",
          hreflang: ["en"],
        },
        {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example2.com",
          title: "Test Link 2",
          default: false,
          relationType: "alternate",
          hreflang: ["fr"],
        },
      ],
    });

    // Act & Assert: Get all links
    return request(app.getHttpServer())
      .get("/links")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            path: expect.any(String),
            type: expect.any(String),
            href: expect.any(String),
            title: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          })
        );
      });
  });

  it("/links/:id (DELETE)", async () => {
    // Arrange: Create a link
    const link = await prismaService.link.create({
      data: {
        path: "/qualifier/identifier",
        type: "text/html",
        href: "https://example.com",
        title: "Test Link",
        default: true,
        relationType: "alternate",
        hreflang: ["en"],
      },
    });

    // Act & Assert: Delete the link
    await request(app.getHttpServer()).delete(`/links/${link.id}`).expect(200);

    // Verify link was deleted
    const deletedLink = await prismaService.link.findUnique({
      where: {id: link.id},
    });
    expect(deletedLink).toBeNull();
  });
});
