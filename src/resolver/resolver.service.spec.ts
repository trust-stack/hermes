import { Test } from "@nestjs/testing";
import { PrismaService } from "../prisma/prisma.service";
import { ResolverService } from "./resolver.service";

describe("ResolverService", () => {
  let resolverService: ResolverService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService, ResolverService],
    }).compile();

    resolverService = moduleRef.get<ResolverService>(ResolverService);
    prismaService = moduleRef.get<PrismaService>(PrismaService);
  });

  describe("resolve", () => {
    describe("external resolvers", () => {
      it("will match a identifier against external resolver configurations.", async () => {
        jest
          .spyOn(prismaService.externalResolverSet, "findMany")
          .mockResolvedValue([
            {
              id: "test-set",
              pattern: `^(N|3|S|Q|W|NA75|M|T).*`,
              // @ts-ignore
              // TODO: resolve type issues with prisma and mocking
              resolvers: [
                {
                  id: "new-south-whales",
                  pattern: `^(N).*`,
                  href: "https://nsw-pic.com",
                },
              ],
            },
          ]);

        expect(await resolverService.resolve("NSW123456")).toEqual({
          redirectUrl: "https://nsw-pic.com/NSW123456",
        });
      });
    });
  });
});
