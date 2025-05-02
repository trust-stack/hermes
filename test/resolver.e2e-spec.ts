import {INestApplication} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {PrismaClient} from "@prisma/client";
import request from "supertest";
import {AppModule} from "../src/app.module";
import {CreateLinkDto} from "../src/link/dtos";

describe("ResolverController (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaClient;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = await moduleFixture.resolve<PrismaClient>("PRISMA_CLIENT");

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.link.deleteMany();
  });

  describe("/* (GET)", () => {
    describe("default redirects", () => {
      it("redirects to the default link of the underlying link set.", async () => {
        const dto: CreateLinkDto = {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example.com",
          title: "Test Link",
          default: true,
          relationType: "untp:dpp",
          hreflang: ["en"],
        };

        // Arrange: Create a link
        await request(app.getHttpServer()).post("/links").send(dto).expect(201);

        // Act: Send request to the resolver
        return request(app.getHttpServer())
          .get("/qualifier/identifier")
          .expect(307)
          .then((response) => {
            expect(response.headers.location).toBe(dto.href);
          });
      });

      it("returns a 404 if no default link is found.", async () => {
        const dto: CreateLinkDto = {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example.com",
          title: "Test Link",
          relationType: "alternate",
          hreflang: ["en"],
        };

        // Arrange: Create a link, not a default
        await request(app.getHttpServer()).post("/links").send(dto).expect(201);

        await request(app.getHttpServer())
          .get("/qualifier/identifier")
          .expect(404);
      });
    });

    describe("linkType=linkset query parameter", () => {
      it("will return all links in the underlying link set.", async () => {
        const dto: CreateLinkDto = {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example.com",
          title: "Test Link",
          relationType: "untp:dpp",
          hreflang: ["en"],
        };

        // Arrange: Create a links
        await request(app.getHttpServer()).post("/links").send(dto).expect(201);
        await request(app.getHttpServer())
          .post("/links")
          .send({
            ...dto,
            href: "https://example.com/fr",
            hreflang: ["fr"],
          })
          .expect(201);

        // Act: Send request to the resolver
        await request(app.getHttpServer())
          .get("/qualifier/identifier?linkType=linkset")
          .expect(200)
          .then((response) => {
            const body = response.body;

            // Assert: Links found
            expect(body).toEqual({
              linkset: [
                {
                  anchor: "/qualifier/identifier",
                  linkset: expect.arrayContaining([
                    {
                      href: "https://example.com",
                      title: "Test Link",
                      hreflang: ["en"],
                      type: "text/html",
                    },
                    {
                      href: "https://example.com/fr",
                      title: "Test Link",
                      hreflang: ["fr"],
                      type: "text/html",
                    },
                  ]),
                },
              ],
            });
          });
      });

      it("will return 404 if no links are found.", async () => {
        await request(app.getHttpServer())
          .get("/qualifier/identifier?linkType=linkset")
          .expect(404);
      });
    });

    describe("linkType query parameter", () => {
      it("will return the link of the given type.", async () => {
        const dto: CreateLinkDto = {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example.com",
          title: "Test Link",
          relationType: "untp:dpp",
          hreflang: ["en"],
        };

        // Arrange: Create a link
        await request(app.getHttpServer()).post("/links").send(dto).expect(201);

        // Act: Send request to the resolver
        await request(app.getHttpServer())
          .get("/qualifier/identifier?linkType=untp:dpp")
          .expect(307)
          .then((response) => {
            expect(response.headers.location).toBe(dto.href);
          });
      });

      it("will return 404 if no link is found.", async () => {
        const dto: CreateLinkDto = {
          path: "/qualifier/identifier",
          type: "text/html",
          href: "https://example.com",
          title: "Test Link",
          relationType: "gs1:pip",
          hreflang: ["en"],
        };

        // Arrange: Create a link
        await request(app.getHttpServer()).post("/links").send(dto).expect(201);

        await request(app.getHttpServer())
          .get("/qualifier/identifier?linkType=untp:dpp")
          .expect(404);
      });
    });
  });
});
