import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { ResolverController } from "./resolver.controller";
import { ResolverService } from "./resolver.service";

describe("ResolverController (e2e)", () => {
  let app: INestApplication;
  let resolverService = { resolve: jest.fn() };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ResolverController],
      providers: [
        {
          provide: ResolverService,
          useValue: resolverService,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should redirect when a External Resolver is found.", async () => {
    const redirectUrl = `https://example.com/redirect`;

    resolverService.resolve.mockResolvedValue({ redirectUrl });

    await request(app.getHttpServer())
      .get("/NSW123456")
      .expect(302)
      .expect("Location", redirectUrl);
  });
});
