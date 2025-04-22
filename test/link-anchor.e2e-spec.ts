import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { LinkAnchorDto } from "../src/link-anchor/dtos";

describe("LinkAnchor (e2e)", () => {
  let app: INestApplication;
  let prismaService: PrismaClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = await moduleFixture.resolve<PrismaClient>("PRISMA_CLIENT");

    await app.init();
  });

  beforeEach(async () => {
    await prismaService.linkAnchor.deleteMany();
    await prismaService.linkSet.deleteMany();
  });

  /**
   * Test Case: Mint a new link anchor
   *
   * 1. Send a POST request to mint a new link anchor
   * 2. Verify the response contains the expected fields
   */
  it("/link-anchors/mint (POST)", async () => {
    await request(app.getHttpServer())
      .post("/link-anchors/mint")
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
  });

  /**
   * Test Case: Mint multiple link anchors
   *
   * 1. Send a POST request to mint multiple link anchors
   * 2. Verify the response contains the expected number of anchors
   * 3. Verify each anchor has the expected fields
   */
  it("/link-anchors/mint-many (POST)", async () => {
    const quantity = 5;

    await request(app.getHttpServer())
      .post("/link-anchors/mint-many")
      .send({ quantity })
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveLength(quantity);
        response.body.forEach((anchor: LinkAnchorDto) => {
          expect(anchor).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          );
        });
      });
  });

  /**
   * Test Case: Set a link set for a link anchor
   *
   * 1. Create a link set
   * 2. Mint a link anchor
   * 3. Set the link set for the anchor
   * 4. Verify the link anchor is updated
   * 5. Verify the link set can be resolved through the anchor
   */
  it("/link-anchors/:id/set (POST)", async () => {
    // First create a link set
    const linkSet = await prismaService.linkSet.create({
      data: {
        identifier: "NSW123456",
        qualifier: "PIC",
        links: {
          createMany: {
            data: [
              {
                relationType: "describedBy",
                href: "https://example.com",
                title: "Product Description",
                lang: ["en"],
              },
            ],
          },
        },
      },
    });

    // Mint a new anchor
    let anchorId: string;
    await request(app.getHttpServer())
      .post("/link-anchors/mint")
      .expect(201)
      .then((response) => {
        anchorId = response.body.id;
      });

    // Set the link set for the anchor
    await request(app.getHttpServer())
      .post(`/link-anchors/${anchorId}/set`)
      .send({ linkSetId: linkSet.id })
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: anchorId,
            linkSetId: linkSet.id,
          }),
        );
      });

    // Verify we can resolve the link set through the anchor
    await request(app.getHttpServer())
      .get(`/${anchorId}`)
      .expect(302)
      .expect("Location", "/PIC/NSW123456");
  });

  /**
   * Test Case: Get a link anchor
   *
   * 1. Mint a link anchor
   * 2. Get the link anchor by ID
   * 3. Verify the response contains the expected fields
   */
  it("/link-anchors/:id (GET)", async () => {
    // Mint a new anchor
    let anchorId: string;
    await request(app.getHttpServer())
      .post("/link-anchors/mint")
      .expect(201)
      .then((response) => {
        anchorId = response.body.id;
      });

    // Get the anchor
    await request(app.getHttpServer())
      .get(`/link-anchors/${anchorId}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            id: anchorId,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          }),
        );
      });
  });

  /**
   * Test Case: Get multiple link anchors with pagination
   *
   * 1. Mint multiple link anchors
   * 2. Get anchors with pagination
   * 3. Verify pagination works correctly
   */
  it("/link-anchors (GET)", async () => {
    // Mint 10 anchors
    await request(app.getHttpServer())
      .post("/link-anchors/mint-many")
      .send({ quantity: 10 })
      .expect(201);

    // Get all anchors
    await request(app.getHttpServer())
      .get("/link-anchors")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(10);
      });

    // Get paginated anchors
    await request(app.getHttpServer())
      .get("/link-anchors?limit=5")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(5);
      });
  });
});
