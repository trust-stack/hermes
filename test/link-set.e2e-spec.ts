import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { LinkSetDto, UpsertLinkSetDto } from "../src/link-set/link-set.dto";
import { PrismaService } from "../src/prisma/prisma.service";

describe("LinkSet (e2e)", () => {
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

  /**
   * Test Case: Create a link set, and then resolve a matching identifier
   *
   * 1. Send a POST request to create a simple Link Set
   * 2. Send a GET request to resolve a identifier
   * 3. Verify the link set return
   */
  it("/link-sets (POST)", async () => {
    const dto: UpsertLinkSetDto = {
      identifier: "09524000059109",
      qualifier: "01",
      links: [
        {
          relationType: "describedBy",
          href: "https://example.com",
          title: "Product Description",
          lang: ["en"],
          type: "HREF",
        },
      ],
    };

    await request(app.getHttpServer())
      .post("/link-sets")
      .send(dto)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            identifier: "09524000059109",
            qualifier: "01",
            links: [
              expect.objectContaining({
                relationType: "describedBy",
                href: "https://example.com",
                title: "Product Description",
                lang: ["en"],
              }),
            ],
          }),
        );
      });

    await request(app.getHttpServer())
      .get("/01/09524000059109")
      .expect(200)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            linkSet: [
              expect.objectContaining({
                anchor: "/01/09524000059109",
                describedBy: [
                  {
                    href: "https://example.com",
                    title: "Product Description",
                    lang: ["en"],
                  },
                ],
              }),
            ],
          }),
        );
      });
  });

  /**
   * Test Case: Create a link set, and then request it
   *
   * 1. Send a POST request to create a simple Link Set
   * 2. Send a GET request to fetch the link set
   */
  it("/link-sets/:id (GET)", async () => {
    let dtoResponse: LinkSetDto;

    const dto: UpsertLinkSetDto = {
      identifier: "09524000059109",
      qualifier: "01",
      links: [
        {
          relationType: "describedBy",
          href: "https://example.com",
          title: "Product Description",
          lang: ["en"],
          type: "HREF",
        },
      ],
    };

    await request(app.getHttpServer())
      .post("/link-sets")
      .send(dto)
      .expect(201)
      .then((response) => {
        dtoResponse = response.body;
        expect(response.body).toEqual(
          expect.objectContaining({
            identifier: "09524000059109",
            qualifier: "01",
            links: [
              expect.objectContaining({
                relationType: "describedBy",
                href: "https://example.com",
                title: "Product Description",
                lang: ["en"],
              }),
            ],
          }),
        );
      });

    await request(app.getHttpServer())
      .get(`/link-sets/${dtoResponse.id}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: dtoResponse.id,
            identifier: "09524000059109",
            qualifier: "01",
            links: [
              expect.objectContaining({
                relationType: "describedBy",
                href: "https://example.com",
                title: "Product Description",
                lang: ["en"],
              }),
            ],
          }),
        );
      });
  });

  /**
   * Test Case: Create many link set, and then request many
   *
   * 1. Populate database with many link sets
   * 2. Send a GET request to fetch the link sets
   * 2. Send a GET request and paginate
   */
  it("/link-sets (GET)", async () => {
    await prismaService.$transaction(
      Array(10)
        .fill(null)
        .map((_, index) =>
          prismaService.linkset.create({
            data: {
              identifier: `09524000059109${index}`,
              qualifier: "01",
              links: {
                createMany: {
                  data: [
                    {
                      relationType: "describedBy",
                      href: `https://example.com/${index}`,
                      title: `Product ${index} Description`,
                      lang: ["en"],
                      type: "HREF",
                    },
                  ],
                },
              },
            },
          }),
        ),
    );

    await request(app.getHttpServer())
      .get(`/link-sets`)
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(10);
      });

    await request(app.getHttpServer())
      .get("/link-sets?limit=2")
      .expect(200)
      .then((response) => {
        expect(response.body.length).toEqual(2);
      });
  });

  /**
   * Test Case: Create many link set, and then request many
   *
   * 1. Send a POST request to create the link sets
   * 2. Send a DELETE request to delete
   * 3. Send a GET request and verify deleted
   */
  it("/link-sets (DELETE)", async () => {
    let responseDto: LinkSetDto;

    const dto: UpsertLinkSetDto = {
      identifier: "09524000059109",
      qualifier: "01",
      links: [
        {
          relationType: "describedBy",
          href: "https://example.com",
          title: "Product Description",
          lang: ["en"],
        },
      ],
    };

    await request(app.getHttpServer())
      .post("/link-sets")
      .send(dto)
      .expect(201)
      .then((response) => {
        responseDto = response.body;
        expect(response.body).toEqual(
          expect.objectContaining({
            identifier: "09524000059109",
            qualifier: "01",
            links: [
              expect.objectContaining({
                relationType: "describedBy",
                href: "https://example.com",
                title: "Product Description",
                lang: ["en"],
              }),
            ],
          }),
        );
      });

    await request(app.getHttpServer())
      .delete(`/link-sets/${responseDto.id}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/link-sets/${responseDto.id}`)
      .expect(404);
  });
});
